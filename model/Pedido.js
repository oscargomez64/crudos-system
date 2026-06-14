const pool = require('../db/connect');

const UPDATE_FIELDS = new Set(['Fecha', 'TotalVenta', 'IdCliente']);

const GROUP_FIELD_MAP = {
  cliente: 'c.Nombre',
  tipoCliente: 'c.TipoCliente',
  fecha: 'p.Fecha'
};

const AGGREGATE_FIELD_MAP = {
  totalComprado: 'p.TotalVenta',
  totalVenta: 'p.TotalVenta',
  count: '*'
};

const AGGREGATE_FUNCTIONS = new Set(['SUM', 'COUNT', 'AVG', 'MIN', 'MAX']);

const JOIN_FIELD_MAP = {
  'cliente.idCliente': 'c.IdCliente',
  'cliente.nombre': 'c.Nombre',
  'cliente.rfc': 'c.RFC',
  'cliente.ciudad': 'c.Ciudad',
  'cliente.tipoCliente': 'c.TipoCliente',
  'pedido.idPedido': 'p.IdPedido',
  'pedido.fecha': 'p.Fecha',
  'pedido.totalVenta': 'p.TotalVenta',
  'pedido.idCliente': 'p.IdCliente'
};

function buildUpdateClause(atributosActualizar) {
  const entries = Object.entries(atributosActualizar)
    .filter(([field]) => UPDATE_FIELDS.has(field));

  if (entries.length === 0) {
    throw new Error('No hay campos validos para actualizar Pedido.');
  }

  return {
    clause: entries.map(([field]) => `${field} = ?`).join(', '),
    values: entries.map(([, value]) => value)
  };
}

async function getPedidos() {
  const [rows] = await pool.query('SELECT * FROM Pedido');
  return rows;
}

async function getPedidoById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM Pedido WHERE IdPedido = ?',
    [id]
  );

  return rows[0];
}

async function getAggregate(groupByField, aggregates, havingCondition = null) {
  const groupColumn = GROUP_FIELD_MAP[groupByField];

  if (!groupColumn) {
    throw new Error(`Campo groupBy no permitido: ${groupByField}`);
  }

  const selectClauses = [`${groupColumn} AS ${groupByField}`];
  const aggregateAliases = new Set();
  const params = [];

  aggregates.forEach((agg) => {
    const column = AGGREGATE_FIELD_MAP[agg.field];
    const func = String(agg.func || '').toUpperCase();

    if (!column) {
      throw new Error(`Campo agregado no permitido: ${agg.field}`);
    }

    if (!AGGREGATE_FUNCTIONS.has(func)) {
      throw new Error(`Funcion de agregacion no permitida: ${agg.func}`);
    }

    aggregateAliases.add(agg.field);
    const expression = column === '*' ? `${func}(*)` : `${func}(${column})`;
    selectClauses.push(`${expression} AS \`${agg.field}\``);
  });

  let query = `
    SELECT ${selectClauses.join(', ')}
    FROM Cliente c
    INNER JOIN Pedido p ON c.IdCliente = p.IdCliente
    GROUP BY ${groupColumn}
  `;

  if (havingCondition) {
    const operatorMap = {
      gt: '>',
      gte: '>=',
      lt: '<',
      lte: '<=',
      eq: '=',
      ne: '!='
    };

    const sqlOperator = operatorMap[havingCondition.operator];

    if (!sqlOperator || !aggregateAliases.has(havingCondition.field)) {
      throw new Error('Condicion HAVING no valida.');
    }

    query += ` HAVING \`${havingCondition.field}\` ${sqlOperator} ?`;
    params.push(havingCondition.value);
  }

  const [results] = await pool.query(query, params);
  return results;
}

async function getPedidosWithJoin(joinTable, fields) {
  if (!joinTable && (!fields || fields.length === 0)) {
    return getPedidos();
  }

  if (joinTable !== 'cliente') {
    throw new Error('Solo se permite join=cliente.');
  }

  if (!Array.isArray(fields) || fields.length === 0) {
    throw new Error('Debe especificar fields para la consulta con join.');
  }

  const selectClauses = fields.map((field) => {
    const column = JOIN_FIELD_MAP[field];

    if (!column) {
      throw new Error(`Campo no permitido para join: ${field}`);
    }

    return `${column} AS \`${field}\``;
  });

  const query = `
    SELECT ${selectClauses.join(', ')}
    FROM Pedido p
    INNER JOIN Cliente c ON p.IdCliente = c.IdCliente
  `;

  const [results] = await pool.query(query);
  return results;
}

async function createPedido(idPedido, fecha, totalVenta, idCliente) {
  const [result] = await pool.query(
    'INSERT INTO Pedido (IdPedido, Fecha, TotalVenta, IdCliente) VALUES (?, ?, ?, ?)',
    [idPedido, fecha, totalVenta, idCliente]
  );

  return result.insertId;
}

async function updatePedido(id, atributosActualizar) {
  const { clause, values } = buildUpdateClause(atributosActualizar);
  values.push(id);

  const [result] = await pool.query(
    `UPDATE Pedido SET ${clause} WHERE IdPedido = ?`,
    values
  );

  return result.affectedRows;
}

async function deletePedido(id) {
  const [result] = await pool.query(
    'DELETE FROM Pedido WHERE IdPedido = ?',
    [id]
  );

  return result.affectedRows;
}

module.exports = {
  getPedidos,
  getPedidoById,
  getPedidosWithJoin,
  getAggregate,
  createPedido,
  updatePedido,
  deletePedido
};
