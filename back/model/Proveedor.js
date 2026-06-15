const pool = require('../db/connect');

const FIELD_MAP = {
  idProveedor: 'IdProveedor',
  nombre: 'Nombre',
  telefono: 'Telefono',
  ciudad: 'Ciudad'
};

const UPDATE_FIELDS = new Set(['Nombre', 'Telefono', 'Ciudad']);

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
    throw new Error('No hay campos validos para actualizar Proveedor.');
  }

  return {
    clause: entries.map(([field]) => `${field} = ?`).join(', '),
    values: entries.map(([, value]) => value)
  };
}

async function getProveedores() {
  const [rows] = await pool.query('SELECT * FROM Proveedor');
  return rows;
}

async function getProveedorById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM Proveedor WHERE IdProveedor = ?',
    [id]
  );

  return rows[0];
}

async function getProveedoresProyeccion(campos, ciudad) {
  const clausula = buildSelectClause(campos);
  const params = [];
  let consulta = `SELECT ${clausula} FROM Proveedor`;

  if (ciudad) {
    consulta += ' WHERE Ciudad = ?';
    params.push(ciudad);
  }

  const [result] = await pool.query(consulta, params);
  return result;
}

async function createProveedor(id, nombre, telefono, ciudad) {
  const [result] = await pool.query(
    'INSERT INTO Proveedor (IdProveedor, Nombre, Telefono, Ciudad) VALUES (?, ?, ?, ?)',
    [id, nombre, telefono, ciudad]
  );

  return result.insertId;
}

async function updateProveedor(id, atributosActualizar) {
  const { clause, values } = buildUpdateClause(atributosActualizar);
  values.push(id);

  const [result] = await pool.query(
    `UPDATE Proveedor SET ${clause} WHERE IdProveedor = ?`,
    values
  );

  return result.affectedRows;
}

async function deleteProveedor(id) {
  const [result] = await pool.query(
    'DELETE FROM Proveedor WHERE IdProveedor = ?',
    [id]
  );

  return result.affectedRows;
}

module.exports = {
  getProveedores,
  getProveedorById,
  getProveedoresProyeccion,
  createProveedor,
  updateProveedor,
  deleteProveedor
};
