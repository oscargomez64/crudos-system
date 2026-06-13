const pool = require('../db/connect');

// Consultar todos los ingredientes de cerveza
async function getCervezaIngredientes() {
  const [rows] = await pool.query(
    'SELECT * FROM Cerveza_Ingrediente'
  );

  return rows;
}

// Consultar ingredientes de cerveza por id de ambos
async function getCervezaIngredienteById(idCerveza, idIngrediente) {
  const [rows] = await pool.query(
    'SELECT * FROM Cerveza_Ingrediente WHERE IdCerveza = ? AND IdIngrediente = ?',
    [idCerveza, idIngrediente]
  );

  return rows[0];
}

// Crear cerveza_ingrediente
async function createCervezaIngrediente(idCerveza, idIngrediente, cantidadRequerida) {
  const [result] = await pool.query(
    'INSERT INTO Cerveza_Ingrediente (IdCerveza, IdIngrediente, CantidadRequerida) VALUES ' +
    '(?, ?, ?)',
    [idCerveza, idIngrediente, cantidadRequerida]
  );

  return result.insertId;
}

// Actualizar ingredientes de cerveza
async function updateCervezaIngrediente(idCerveza, idIngrediente, atributosActualizar) {
  const atributos = Object.keys(atributosActualizar);
  const clausula = atributos.map(campo => `${campo} = ?`).join(', ');
  const valores = atributos.map(campo => atributosActualizar[campo]);

  const consulta = `UPDATE Cerveza_Ingrediente SET ${clausula} WHERE IdCerveza = ? AND IdIngrediente = ?`;
  valores.push(idCerveza);
  valores.push(idIngrediente);

  const [result] = await pool.query(consulta, valores);

  return result.affectedRows;
}

// Eliminar ingredientes de cerveza
async function deleteCervezaIngrediente(idCerveza, idIngrediente) {
  const [result] = await pool.query(
    'DELETE FROM Pedido WHERE IdCerveza = ? AND IdIngrediente = ?',
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
