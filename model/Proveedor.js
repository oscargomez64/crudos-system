const pool = require('../db/connect');

// Consultar todos los proveedores
async function getProveedores() {
  const [rows] = await pool.query(
    'SELECT * FROM Proveedor'
  );

  return rows;
}

// Consultar proveedor por id
async function getProveedorById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM Proveedor WHERE IdProveedor = ?',
    [id]
  );

  return rows[0];
}

// Crear proveedor
async function createProveedor(id, nombre, telefono, ciudad) {
  const [result] = await pool.query(
    'INSERT INTO Proveedor (IdProveedor, Nombre, Telefono, Ciudad) VALUES ' +
    '(?, ?, ?, ?)',
    [id, nombre, telefono, ciudad]
  );

  return result.insertId;
}

// Actualizar proveedor
async function updateProveedor(id, atributosActualizar) {
  const atributos = Object.keys(atributosActualizar);
  const clausula = atributos.map(campo => `${campo} = ?`).join(', ');
  const valores = atributos.map(campo => atributosActualizar[campo]);

  const consulta = `UPDATE Proveedor SET ${clausula} WHERE IdProveedor = ?`;
  valores.push(id);

  const [result] = await pool.query(consulta, valores);

  return result.affectedRows;
}

// Eliminar proveedor
async function deleteProveedor(id) {
  const [result] = await pool.query(
    'DELETE FROM Proveedor WHERE IdProveedor = ?',
    [id]
  );

  return result.affectedRows;
}

module.exports = {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor
};
