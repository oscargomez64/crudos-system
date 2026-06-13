const pool = require('../db/connect');

// Consultar todos los pedidos
async function getPedidos() {
  const [rows] = await pool.query(
    'SELECT * FROM Pedido'
  );

  return rows;
}

// Consultar pedido por id
async function getPedidoById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM Pedido WHERE IdPedido = ?',
    [id]
  );

  return rows[0];
}

// Crear pedido
async function createPedido(idPedido, fecha, totalVenta, idCliente) {
  const [result] = await pool.query(
    'INSERT INTO Pedido (IdPedido, Fecha, TotalVenta, IdCliente) VALUES ' +
    '(?, ?, ?, ?)',
    [idPedido, fecha, totalVenta, idCliente]
  );

  return result.insertId;
}

// Actualizar pedido
async function updatePedido(id, atributosActualizar) {
  const atributos = Object.keys(atributosActualizar);
  const clausula = atributos.map(campo => `${campo} = ?`).join(', ');
  const valores = atributos.map(campo => atributosActualizar[campo]);

  const consulta = `UPDATE Pedido SET ${clausula} WHERE IdPedido = ?`;
  valores.push(id);

  const [result] = await pool.query(consulta, valores);

  return result.affectedRows;
}

// Eliminar pedido
async function deletePedido(id) {
  const [result] = await pool.query(
    'DELETE FROM Pedido WHERE IdPedido = ?',
    [id]
  );

  return result.affectedRows;
}

module.exports = {
  getPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido
};
