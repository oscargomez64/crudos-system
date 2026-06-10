const pool = require('../db/connect');

// Consultar todos los clientes
async function getClientes() {
  const [rows] = await pool.query(
    'SELECT * FROM Cliente'
  );

  return rows;
}

// Consultar cliente por id
async function getClienteById() {
  const [rows] = await pool.query(
    'SELECT * FROM Cliente WHERE IdCliente = ?',
    [id]
  );

  return rows[0];
}

// Crear cliente
async function crearCliente(id, nombre, rfc, ciudad, tipo) {
  const [result] = await pool.query(
    'INSERT INTO Cliente (IdCliente, Nombre, RFC, Ciudad, TipoCliente) VALUES ' +
    '(?, ?, ?, ?, ?)',
    [id, nombre, rfc, ciudad, tipo]
  );

  return result.insertId;
}

// Actualizar cliente existente
async function updateCliente(id, nombre, rfc, ciudad, tipo) {
  const [result] = await pool.query(
    'UPDATE Cliente SET nombre = ?, rfc = ?, ciudad = ?, tipo = ? WHERE IdCliente = ?',
    [nombre, rfc, ciudad, tipo, id]
  );

  return result.affectedRows;
}

// Eliminar cliente
async function deleteCliente(id) {
  const [result] = await pool.query(
    'DELETE FROM Cliente WHERE IdCliente = ?',
    [id]
  );

  return result.affectedRows;
}

module.exports = {
  getClientes,
  getClienteById,
  crearCliente,
  updateCliente,
  deleteCliente
};
