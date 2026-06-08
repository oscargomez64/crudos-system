const pool = require('../db/connect');

// Crear cerveza
async function crearCerveza(id, nombre, estilo, grado, precio) {
  const [result] = await pool.query(
    'INSERT INTO Cerveza (IdCerveza, Nombre, Estilo, GradoAlcohol, PrecioLitro)' +
    ' VALUES (?, ?, ?, ?, ?)',
    [id, nombre, estilo, grado, precio]
  );

  return result.insertId;
}

module.exports = { crearCerveza };
