const pool = require('../db/connect');

// Crear cerveza_ingrediente
async function crearCervezaIngrediente(idCerveza, idIngrediente, cantidadRequerida) {
  const [result] = await pool.query(
    'INSERT INTO Cerveza_Ingrediente (IdCerveza, IdIngrediente, CantidadRequerida) VALUES ' +
    '(?, ?, ?)',
    [idCerveza, idIngrediente, cantidadRequerida]
  );

  return result.insertId;
}

module.exports = { crearCervezaIngrediente };
