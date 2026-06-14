const pool = require('../db/connect');

const FIELD_MAP = {
  idIngrediente: 'IdIngrediente',
  nombre: 'Nombre',
  unidadMedida: 'UnidadMedida',
  stockActual: 'StockActual',
  idProveedor: 'IdProveedor'
};

const UPDATE_FIELDS = new Set(['Nombre', 'UnidadMedida', 'StockActual', 'IdProveedor']);

function buildSelectClause(campos) {
  return campos.map((campo) => {
    const column = FIELD_MAP[campo];
    if (!column) {
      throw new Error(`Campo no permitido: ${campo}`);
    }
    return `${column} AS ${campo}`;
  }).join(', ');
}

function buildUpdateClause(atributosActualizar) {
  const entries = Object.entries(atributosActualizar)
    .filter(([field]) => UPDATE_FIELDS.has(field));

  if (entries.length === 0) {
    throw new Error('No hay campos validos para actualizar Ingrediente.');
  }

  return {
    clause: entries.map(([field]) => `${field} = ?`).join(', '),
    values: entries.map(([, value]) => value)
  };
}

async function getIngredientes() {
  const [rows] = await pool.query('SELECT * FROM Ingrediente');
  return rows;
}

async function getIngredienteById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM Ingrediente WHERE IdIngrediente = ?',
    [id]
  );

  return rows[0];
}

async function getIngredienteProyeccion(campos, filtros = {}) {
  const clausula = buildSelectClause(campos);
  const params = [];
  let consulta = `SELECT ${clausula} FROM Ingrediente WHERE 1=1`;

  if (filtros.stockMin !== undefined) {
    consulta += ' AND StockActual >= ?';
    params.push(filtros.stockMin);
  }

  if (filtros.stockMax !== undefined) {
    consulta += ' AND StockActual <= ?';
    params.push(filtros.stockMax);
  }

  const [result] = await pool.query(consulta, params);
  return result;
}

async function createIngrediente(idIngrediente, nombre, unidad, stock, idProveedor) {
  const [result] = await pool.query(
    'INSERT INTO Ingrediente (IdIngrediente, Nombre, UnidadMedida, StockActual, IdProveedor) VALUES (?, ?, ?, ?, ?)',
    [idIngrediente, nombre, unidad, stock, idProveedor]
  );

  return result.insertId;
}

async function updateIngrediente(id, atributosActualizar) {
  const { clause, values } = buildUpdateClause(atributosActualizar);
  values.push(id);

  const [result] = await pool.query(
    `UPDATE Ingrediente SET ${clause} WHERE IdIngrediente = ?`,
    values
  );

  return result.affectedRows;
}

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
