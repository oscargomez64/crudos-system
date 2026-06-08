const pool = require('../db/connect');

// Crear proveedor
async function crearProveedor(id, nombre, telefono, ciudad) {
  const [result] = await pool.query(
    'INSERT INTO Proveedor (IdProveedor, Nombre, Telefono, Ciudad) VALUES ' +
    '(?, ?, ?, ?)',
    [id, nombre, telefono, ciudad]
  );

  return result.insertId;
}

module.exports = { crearProveedor };
