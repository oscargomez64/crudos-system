const pool = require('../db/connect');

const FIELD_MAP = {
  idCerveza: 'IdCerveza',
  nombre: 'Nombre',
  estilo: 'Estilo',
  gradoAlcohol: 'GradoAlcohol',
  precioLitro: 'PrecioLitro'
};

const UPDATE_FIELDS = new Set(['Nombre', 'Estilo', 'GradoAlcohol', 'PrecioLitro']);

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
    throw new Error('No hay campos validos para actualizar Cerveza.');
  }

  return {
    clause: entries.map(([field]) => `${field} = ?`).join(', '),
    values: entries.map(([, value]) => value)
  };
}

async function getCerveza() {
  const [rows] = await pool.query('SELECT * FROM Cerveza');
  return rows;
}

async function getCervezaById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM Cerveza WHERE IdCerveza = ?',
    [id]
  );

  return rows[0];
}

async function getCervezaProyeccion(campos, filtros = {}) {
  const clausula = buildSelectClause(campos);
  const params = [];
  let consulta = `SELECT ${clausula} FROM Cerveza WHERE 1=1`;

  if (filtros.gradoMin !== undefined) {
    consulta += ' AND GradoAlcohol >= ?';
    params.push(filtros.gradoMin);
  }

  if (filtros.gradoMax !== undefined) {
    consulta += ' AND GradoAlcohol <= ?';
    params.push(filtros.gradoMax);
  }

  const [result] = await pool.query(consulta, params);
  return result;
}

async function createCerveza(id, nombre, estilo, grado, precio) {
  const [result] = await pool.query(
    'INSERT INTO Cerveza (IdCerveza, Nombre, Estilo, GradoAlcohol, PrecioLitro) VALUES (?, ?, ?, ?, ?)',
    [id, nombre, estilo, grado, precio]
  );

  return result.insertId;
}

async function updateCerveza(id, atributosActualizar) {
  const { clause, values } = buildUpdateClause(atributosActualizar);
  values.push(id);

  const [result] = await pool.query(
    `UPDATE Cerveza SET ${clause} WHERE IdCerveza = ?`,
    values
  );

  return result.affectedRows;
}

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
  getCervezaProyeccion,
  createCerveza,
  updateCerveza,
  deleteCerveza
};
