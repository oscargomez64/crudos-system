const pool = require('../db/connect');

const FIELD_MAP = {
  idCliente: 'IdCliente',
  nombre: 'Nombre',
  rfc: 'RFC',
  ciudad: 'Ciudad',
  tipoCliente: 'TipoCliente'
};

const UPDATE_FIELDS = new Set(['Nombre', 'RFC', 'Ciudad', 'TipoCliente']);

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
    throw new Error('No hay campos validos para actualizar Cliente.');
  }

  return {
    clause: entries.map(([field]) => `${field} = ?`).join(', '),
    values: entries.map(([, value]) => value)
  };
}

async function getClientes() {
  const [rows] = await pool.query('SELECT * FROM Cliente');
  return rows;
}

async function getClienteById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM Cliente WHERE IdCliente = ?',
    [id]
  );

  return rows[0];
}

async function getClientesProyeccion(campos, tipo) {
  const clausula = buildSelectClause(campos);
  const params = [];
  let consulta = `SELECT ${clausula} FROM Cliente`;

  if (tipo) {
    consulta += ' WHERE TipoCliente = ?';
    params.push(tipo);
  }

  const [result] = await pool.query(consulta, params);
  return result;
}

async function createCliente(id, nombre, rfc, ciudad, tipoCliente) {
  const [result] = await pool.query(
    'INSERT INTO Cliente (IdCliente, Nombre, RFC, Ciudad, TipoCliente) VALUES (?, ?, ?, ?, ?)',
    [id, nombre, rfc, ciudad, tipoCliente]
  );

  return result.insertId;
}

async function updateCliente(id, atributosActualizar) {
  const { clause, values } = buildUpdateClause(atributosActualizar);
  values.push(id);

  const [result] = await pool.query(
    `UPDATE Cliente SET ${clause} WHERE IdCliente = ?`,
    values
  );

  return result.affectedRows;
}

async function deleteCliente(id) {
  const [result] = await pool.query(
    'DELETE FROM Cliente WHERE IdCliente = ?',
    [id]
  );

  return result.affectedRows;
}

module.exports = {
  getClientes,
  getClienteById,
  getClientesProyeccion,
  createCliente,
  updateCliente,
  deleteCliente
};
