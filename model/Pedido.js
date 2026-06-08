const pool = require('../db/connect');

// Crear pedido
async function crearPedido(idPedido, fecha, totalVenta, idCliente) {
  const [result] = await pool.query(
    'INSERT INTO Pedido (IdPedido, Fecha, TotalVenta, IdCliente) VALUES ' +
    '(?, ?, ?, ?)',
    [idPedido, fecha, totalVenta, idCliente]
  );

  return result.insertId;
}

module.exports = { crearPedido };
