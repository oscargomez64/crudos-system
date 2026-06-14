const pool = require('../db/connect');

const UPDATE_FIELDS = new Set(['CantidadLitros', 'PrecioUnitarioAplicado']);

function buildUpdateClause(atributosActualizar) {
  const entries = Object.entries(atributosActualizar)
    .filter(([field]) => UPDATE_FIELDS.has(field));

  if (entries.length === 0) {
    throw new Error('No hay campos validos para actualizar Pedido_Cerveza.');
  }

  return {
    clause: entries.map(([field]) => `${field} = ?`).join(', '),
    values: entries.map(([, value]) => value)
  };
}

async function getPedidoCerveza() {
  const [rows] = await pool.query('SELECT * FROM Pedido_Cerveza');
  return rows;
}

async function getPedidoCervezaById(idPedido, idCerveza) {
  const [rows] = await pool.query(
    'SELECT * FROM Pedido_Cerveza WHERE IdPedido = ? AND IdCerveza = ?',
    [idPedido, idCerveza]
  );

  return rows[0];
}

async function createPedidoCerveza(idPedido, idCerveza, cantidadLitros, precioUnitarioAplicado) {
  const [result] = await pool.query(
    'INSERT INTO Pedido_Cerveza (IdPedido, IdCerveza, CantidadLitros, PrecioUnitarioAplicado) VALUES (?, ?, ?, ?)',
    [idPedido, idCerveza, cantidadLitros, precioUnitarioAplicado]
  );

  return result.insertId;
}

async function updatePedidoCerveza(idPedido, idCerveza, atributosActualizar) {
  const { clause, values } = buildUpdateClause(atributosActualizar);
  values.push(idPedido, idCerveza);

  const [result] = await pool.query(
    `UPDATE Pedido_Cerveza SET ${clause} WHERE IdPedido = ? AND IdCerveza = ?`,
    values
  );

  return result.affectedRows;
}

async function deletePedidoCerveza(idPedido, idCerveza) {
  const [result] = await pool.query(
    'DELETE FROM Pedido_Cerveza WHERE IdPedido = ? AND IdCerveza = ?',
    [idPedido, idCerveza]
  );

  return result.affectedRows;
}

module.exports = {
  getPedidoCerveza,
  getPedidoCervezaById,
  createPedidoCerveza,
  updatePedidoCerveza,
  deletePedidoCerveza
};
