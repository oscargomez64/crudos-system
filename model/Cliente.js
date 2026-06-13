const pool = require('../db/connect');

// Consultar todos los clientes
async function getClientes() {
  const [rows] = await pool.query(
    'SELECT * FROM Cliente'
  );

  return rows;
}

// Consultar cliente por id
async function getClienteById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM Cliente WHERE IdCliente = ?',
    [id]
  );

  return rows[0];
}

// Crear cliente
async function createCliente(id, nombre, rfc, ciudad, tipo) {
  const [result] = await pool.query(
    'INSERT INTO Cliente (IdCliente, Nombre, RFC, Ciudad, TipoCliente) VALUES ' +
    '(?, ?, ?, ?, ?)',
    [id, nombre, rfc, ciudad, tipo]
  );

  return result.insertId;
}

// Actualizar cliente existente
async function updateCliente(id, atributosActualizar) {
  const atributos = Object.keys(atributosActualizar);
  const clausula = atributos.map(campo => `${campo} = ?`).join(', ');
  const valores = atributos.map(campo => atributosActualizar[campo]);

  const consulta = `UPDATE Cliente SET ${clausula} WHERE IdCliente = ?`;
  valores.push(id);

  const [result] = await pool.query(consulta, valores);

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
  createCliente,
  updateCliente,
  deleteCliente
};
