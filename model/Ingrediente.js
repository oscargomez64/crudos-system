const pool = require('../db/connect');

// Crear ingrediente
async function crearIngrediente(idIngrediente, nombre, unidad, stock, idProveedor) {
  const [result] = await pool.query(
    'INSERT INTO Ingrediente (IdIngrediente, Nombre, UnidadMedida, StockActual, ' +
    'IdProveedor) VALUES (?, ?, ?, ?, ?)',
    [idIngrediente, nombre, unidad, stock, idProveedor]
  );

  return result.insertId;
}

module.exports = { crearIngrediente };
