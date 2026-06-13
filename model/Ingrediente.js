const pool = require('../db/connect');

// Consultar todos los ingredientes
async function getIngredientes() {
  const [rows] = await pool.query(
    'SELECT * FROM Ingrediente'
  );

  return rows;
}

// Consultar ingrediente por id
async function getIngredienteById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM Ingrediente WHERE IdIngrediente = ?',
    [id]
  );

  return rows[0];
}

// Proyectar campos ingrediente
async function getIngredienteProyeccion(campos, filtros = {}) {
  const clausula = campos.join(', ');

  let consulta = `SELECT ${clausula} FROM Ingrediente WHERE 1=1`;
  const params = [];

  if (filtros.stockMin !== undefined) {
    consulta += ` AND StockActual >= ?`;
    params.push(filtros.stockMin);
  }

  if (filtros.stockMax !== undefined) {
    consulta += ` AND StockActual <= ?`;
    params.push(filtros.stockMax);
  }


  const [result] = await pool.query(consulta, params);
  return result;
}

// Crear ingrediente
async function createIngrediente(idIngrediente, nombre, unidad, stock, idProveedor) {
  const [result] = await pool.query(
    'INSERT INTO Ingrediente (IdIngrediente, Nombre, UnidadMedida, StockActual, ' +
    'IdProveedor) VALUES (?, ?, ?, ?, ?)',
    [idIngrediente, nombre, unidad, stock, idProveedor]
  );

  return result.insertId;
}

// Actualizar ingrediente
async function updateIngrediente(id, atributosActualizar) {
  const atributos = Object.keys(atributosActualizar);
  const clausula = atributos.map(campo => `${campo} = ?`).join(', ');
  const valores = atributos.map(campo => atributosActualizar[campo]);

  const consulta = `UPDATE Ingrediente SET ${clausula} WHERE IdIngrediente = ?`;
  valores.push(id);

  const [result] = await pool.query(consulta, valores);

  return result.affectedRows;
}

// Eliminar ingrediente
async function deleteIngrediente(id) {
  const [result] = await pool.query(
    'DELETE FROM Ingrediente WHERE IdIngrediente = ?',
    [id]
  );

  return result.affectedRows;
}

module.exports = {
  getIngredientes,
  getIngredienteById,
  getIngredienteProyeccion,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente
};
