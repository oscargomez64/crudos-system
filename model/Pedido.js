const pool = require('../db/connect');

// Consultar todos los pedidos
async function getPedidos() {
  const [rows] = await pool.query(
    'SELECT * FROM Pedido'
  );

  return rows;
}

// Consultar pedido por id
async function getPedidoById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM Pedido WHERE IdPedido = ?',
    [id]
  );

  return rows[0];
}

async function getAggregate(groupByField, aggregates, havingCondition = null) {
  // Map frontend field names to database columns
  const fieldMap = {
    'cliente': 'c.Nombre',
    'tipoCliente': 'c.TipoCliente',
    'fecha': 'p.Fecha'
  };
  
  // Map field names to table columns for aggregates
  const aggregateMap = {
    'totalComprado': 'p.TotalVenta',
    'totalVenta': 'p.TotalVenta',
    'count': '1'
  };
  
  const selectClauses = [fieldMap[groupByField]];
  
  aggregates.forEach(agg => {
    const column = aggregateMap[agg.field];
    if (!column) throw new Error(`Campo inválido: ${agg.field}`);
    selectClauses.push(`${agg.func}(${column}) AS ${agg.field}`);
  });
  
  let query = `
    SELECT ${selectClauses.join(', ')}
    FROM Cliente c
    INNER JOIN Pedido p ON c.IdCliente = p.IdCliente
    GROUP BY ${fieldMap[groupByField]}
  `;

  // Add HAVING clause
  if (havingCondition) {
    const operatorMap = {
      'gt': '>',
      'gte': '>=',
      'lt': '<',
      'lte': '<=',
      'eq': '=',
      'ne': '!='
    };
    
    const sqlOperator = operatorMap[havingCondition.operator];
    query += ` HAVING ${havingCondition.field} ${sqlOperator} ${havingCondition.value}`;
  }
  
  const [results] = await pool.query(query);
  return results;
}

async function getPedidosWithJoin(joinTable, fields) {
  // Map field names to SQL columns
  const fieldMap = {
    'cliente.idCliente': 'c.IdCliente',
    'cliente.nombre': 'c.Nombre',
    'cliente.rfc': 'c.RFC',
    'cliente.ciudad': 'c.Ciudad',
    'cliente.tipoCliente': 'c.TipoCliente',
    'pedido.idPedido': 'p.IdPedido',
    'pedido.fecha': 'p.Fecha',
    'pedido.totalVenta': 'p.TotalVenta',
    'pedido.idCliente': 'p.IdCliente',
  };
  
  const selectClauses = fields.map(f => `${fieldMap[f]} AS '${f}'`);
  
  let query = `SELECT ${selectClauses.join(', ')} FROM Pedido p `;
  
  if (joinTable === 'cliente') {
    query += `INNER JOIN Cliente c ON p.IdCliente = c.IdCliente`;
  }
  
  const [results] = await pool.query(query);
  return results;
}

// Crear pedido
async function createPedido(idPedido, fecha, totalVenta, idCliente) {
  const [result] = await pool.query(
    'INSERT INTO Pedido (IdPedido, Fecha, TotalVenta, IdCliente) VALUES ' +
    '(?, ?, ?, ?)',
    [idPedido, fecha, totalVenta, idCliente]
  );

  return result.insertId;
}

// Actualizar pedido
async function updatePedido(id, atributosActualizar) {
  const atributos = Object.keys(atributosActualizar);
  const clausula = atributos.map(campo => `${campo} = ?`).join(', ');
  const valores = atributos.map(campo => atributosActualizar[campo]);

  const consulta = `UPDATE Pedido SET ${clausula} WHERE IdPedido = ?`;
  valores.push(id);

  const [result] = await pool.query(consulta, valores);

  return result.affectedRows;
}

// Eliminar pedido
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
