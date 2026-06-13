const pool = require('../db/connect');

// Consultar todos los pedidos de cervezas
async function getPedidoCerveza() {
  const [rows] = await pool.query(
    'SELECT * FROM Pedido_Cerveza'
  );

  return rows;
}

// Consultar pedidos de cerveza por id de ambos
async function getPedidoCervezaById(idPedido, idCerveza) {
  const [rows] = await pool.query(
    'SELECT * FROM Pedido_Cerveza WHERE IdPedido = ? AND IdCerveza = ?',
    [idPedido, idCerveza]
  );

  return rows[0];
}

// Crear pedido_cerveza
async function createPedidoCerveza(idPedido, idCerveza, cantidadLitros, precioUnitario) {
  const [result] = await pool.query(
    'INSERT INTO Pedido_Cerveza (IdPedido, IdCerveza, CantidadLitros, PrecioUnitarioAplicado)' +
    ' VALUES (?, ?, ?, ?)',
    [idPedido, idCerveza, cantidadLitros, precioUnitario]
  );

  return result.insertId;
}

// Actualizar pedido de cerveza
async function updatePedidoCerveza(idPedido, idCerveza, atributosActualizar) {
  const atributos = Object.keys(atributosActualizar);
  const clausula = atributos.map(campo => `${campo} = ?`).join(', ');
  const valores = atributos.map(campo => atributosActualizar[campo]);

  const consulta = `UPDATE Pedido SET ${clausula} WHERE IdPedido = ? AND IdCerveza = ?`;
  valores.push(idPedido);
  valores.push(idCerveza);

  const [result] = await pool.query(consulta, valores);

  return result.affectedRows;
}

// Eliminar pedido de cerveza
async function deletePedidoCerveza(idPedido, idCerveza) {
  const [result] = await pool.query(
    'DELETE FROM Pedido WHERE IdPedido = ? AND IdCerveza = ?',
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
