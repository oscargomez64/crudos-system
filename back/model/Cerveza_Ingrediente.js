const pool = require('../db/connect');

const UPDATE_FIELDS = new Set(['CantidadRequerida']);

function buildUpdateClause(atributosActualizar) {
  const entries = Object.entries(atributosActualizar)
    .filter(([field]) => UPDATE_FIELDS.has(field));

  if (entries.length === 0) {
    throw new Error('No hay campos validos para actualizar Cerveza_Ingrediente.');
  }

  return {
    clause: entries.map(([field]) => `${field} = ?`).join(', '),
    values: entries.map(([, value]) => value)
  };
}

async function getCervezaIngredientes() {
  const [rows] = await pool.query('SELECT * FROM Cerveza_Ingrediente');
  return rows;
}

async function getCervezaIngredienteById(idCerveza, idIngrediente) {
  const [rows] = await pool.query(
    'SELECT * FROM Cerveza_Ingrediente WHERE IdCerveza = ? AND IdIngrediente = ?',
    [idCerveza, idIngrediente]
  );

  return rows[0];
}

async function createCervezaIngrediente(idCerveza, idIngrediente, cantidadRequerida) {
  const [result] = await pool.query(
    'INSERT INTO Cerveza_Ingrediente (IdCerveza, IdIngrediente, CantidadRequerida) VALUES (?, ?, ?)',
    [idCerveza, idIngrediente, cantidadRequerida]
  );

  return result.insertId;
}

async function updateCervezaIngrediente(idCerveza, idIngrediente, atributosActualizar) {
  const { clause, values } = buildUpdateClause(atributosActualizar);
  values.push(idCerveza, idIngrediente);

  const [result] = await pool.query(
    `UPDATE Cerveza_Ingrediente SET ${clause} WHERE IdCerveza = ? AND IdIngrediente = ?`,
    values
  );

  return result.affectedRows;
}

async function deleteCervezaIngrediente(idCerveza, idIngrediente) {
  const [result] = await pool.query(
    'DELETE FROM Cerveza_Ingrediente WHERE IdCerveza = ? AND IdIngrediente = ?',
    [idCerveza, idIngrediente]
  );

  return result.affectedRows;
}

module.exports = {
  getCervezaIngredientes,
  getCervezaIngredienteById,
  createCervezaIngrediente,
  updateCervezaIngrediente,
  deleteCervezaIngrediente
};
