const pool = require('../db/connect');

// Consultar todas las cervezas
async function getCerveza() {
  const [rows] = await pool.query(
    'SELECT * FROM Cerveza'
  );

  return rows;
}

// Consultar cerveza por id
async function getCervezaById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM Cerveza WHERE IdCerveza = ?',
    [id]
  );

  return rows[0];
}

// Crear cerveza
async function createCerveza(id, nombre, estilo, grado, precio) {
  const [result] = await pool.query(
    'INSERT INTO Cerveza (IdCerveza, Nombre, Estilo, GradoAlcohol, PrecioLitro)' +
    ' VALUES (?, ?, ?, ?, ?)',
    [id, nombre, estilo, grado, precio]
  );

  return result.insertId;
}

// Actualizar cerveza
async function updateCerveza(id, atributosActualizar) {
  const atributos = Object.keys(atributosActualizar);
  const clausula = atributos.map(campo => `${campo} = ?`).join(', ');
  const valores = atributos.map(campo => atributosActualizar[campo]);

  const consulta = `UPDATE Cerveza SET ${clausula} WHERE IdCerveza = ?`;
  valores.push(id);

  const [result] = await pool.query(consulta, valores);

  return result.affectedRows;
}

// Eliminar cerveza
async function deleteCerveza(id) {
  const [result] = await pool.query(
    'DELETE FROM Cerveza WHERE IdCerveza = ?',
    [id]
  );

  return result.affectedRows;
}

module.exports = {
  getCerveza,
  getCervezaById,
  createCerveza,
  updateCerveza,
  deleteCerveza
};
