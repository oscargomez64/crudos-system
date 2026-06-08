const pool = require('../db/connect');

// Crear pedido_cerveza
async function crearPedidoCerveza(idPedido, idCerveza, cantidadLitros, precioUnitario) {
  const [result] = await pool.query(
    'INSERT INTO Pedido_Cerveza (IdPedido, IdCerveza, CantidadLitros, PrecioUnitarioAplicado)' +
    ' VALUES (?, ?, ?, ?)',
    [idPedido, idCerveza, cantidadLitros, precioUnitario]
  );

  return result.insertId;
}

module.exports = { crearPedidoCerveza };
