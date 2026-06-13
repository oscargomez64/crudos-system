const pool = require('../db/connect');

// Consultar todas las cervezas
async function getCerveza() {
  const [rows] = await pool.query(
    'SELECT * FROM Cerveza'
  );

  return rows;
}

// Consultar cerveza por id
async function getCervezaById() {
  const [rows] = await pool.query(
    'SELECT * FROM Cerveza WHERE IdCerveza = ?',
    [id]
  );

  return rows[0];
}

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
