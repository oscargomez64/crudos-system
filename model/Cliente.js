const pool = require('../db/connect');

// Crear cliente
async function crearCliente(id, nombre, rfc, ciudad, tipo) {
  const [result] = await pool.query(
    'INSERT INTO Cliente (IdCliente, Nombre, RFC, Ciudad, TipoCliente) VALUES ' +
    '(?, ?, ?, ?, ?)',
    [id, nombre, rfc, ciudad, tipo]
  );

  return result.insertId;
}

module.exports = { crearCliente };
