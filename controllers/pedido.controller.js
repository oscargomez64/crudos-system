const PedidoModel = require('../model/Pedido');

// GET /api/pedido
const getPedidos = async (req, res) => {
  try {
    const pedidos = await PedidoModel.getPedidos();
    res.json({
      success: true,
      pedidos
    });
  } catch (error) {
    console.error('Error al obtener pedidos: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedidos.'
    });
  }
}

// GET /api/pedido/:id
const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await PedidoModel.getPedidoById(id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      pedido
    });
  } catch (error) {
    console.error('Error al obtener pedido por ID: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedido por ID.'
    });
  }
}

const getPedidosAggregate = async (req, res) => {
  try {
    const { groupBy, aggregates, having } = req.query;

    // Parse aggregates string
    const aggregateList = aggregates.split(',').map(agg => {
      const [field, func] = agg.trim().split(':');
      return { field: field.trim(), func: func.trim().toUpperCase() };
    });

    // Parse HAVING clause
    let havingCondition = null;
    if (having) {
      const [field, operator, val] = having.split(':');
      
      const validOperators = ['gt', 'gte', 'lt', 'lte', 'eq', 'ne'];
      if (!validOperators.includes(operator)) {
        return res.status(400).json({
          success: false,
          message: `Operador HAVING inválido: ${operator}`
        });
      }
      
      // Verify the field being filtered is in aggregates
      const aggregateFields = aggregateList.map(a => a.field);
      if (!aggregateFields.includes(field)) {
        return res.status(400).json({
          success: false,
          message: `El campo HAVING '${field}' no está en los agregados`
        });
      }
      
      havingCondition = {
        field: field.trim(),
        operator: operator.trim(),
        value: Number(val)
      };
    }
    
    // Validate aggregate functions
    const validFunctions = ['SUM', 'COUNT', 'AVG', 'MIN', 'MAX'];
    const invalidAggs = aggregateList.filter(agg => !validFunctions.includes(agg.func));
    
    if (invalidAggs.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Funciones de agregación inválidas: ${invalidAggs.map(a => a.func).join(', ')}`
      });
    }
    
    const resultado = await PedidoModel.getAggregate(groupBy, aggregateList, havingCondition);
    
    res.status(200).json({
      success: true,
      data: resultado
    });
  } catch (error) {
    console.error('Error al obtener agregados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener agregados'
    });
  }
}

const getPedidosWithJoin = async (req, res) => {
  try {
    const { join, fields } = req.query;
    
    // Parse fields
    const fieldList = fields.split(',').map(f => f.trim());
    
    // Validate fields format (table.column)
    const fieldPattern = /^(cliente|pedido)\.\w+$/;
    const invalidFields = fieldList.filter(f => !fieldPattern.test(f));
    
    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campos inválidos: ${invalidFields.join(', ')}. Formato: tabla.columna`
      });
    }
    
    // Define allowed fields per table
    const allowedFields = {
      cliente: ['idCliente', 'nombre', 'rfc', 'ciudad', 'tipoCliente'],
      pedido: ['idPedido', 'fecha', 'totalVenta', 'idCliente'],
    };
    
    // Validate each field exists in its table
    for (const field of fieldList) {
      const [table, column] = field.split('.');
      if (!allowedFields[table]?.includes(column)) {
        return res.status(400).json({
          success: false,
          message: `Campo no permitido: ${field}`
        });
      }
    }
    
    const resultado = await PedidoModel.getPedidosWithJoin(
      join,
      fieldList
    );
    
    res.status(200).json({
      success: true,
      data: resultado
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedidos'
    });
  }
};

// POST /api/pedido
const createPedido = async (req, res) => {
  try {
    const { idPedido, fecha, totalVenta, idCliente } = req.body;

    if (!id || !nombre || !telefono || !ciudad) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos obligatorios'
      });
    }

    const insertId = await PedidoModel.createPedido(idPedido, fecha, totalVenta, idCliente);
    res.status(201).json({
      success: true,
      message: 'Se agregó el pedido',
      insertId
    });
  } catch (error) {
    console.error('Error al añadir pedido: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al añadir pedido'
    });
  }
};

// PUT /api/pedido/:id
const updatePedido = async (req, res) => {
  try {
    const { idPedido } = req.params;
    const { fecha, totalVenta, idCliente } = req.body;

    if (!idPedido || isNaN(idPedido)) {
      return res.status(400).json({
        success: false,
        message: 'ID de pedido no válido'
      });
    }

    if (!idCliente || isNaN(idCliente)) {
      return res.status(400).json({
        success: false,
        message: 'ID de cliente no válido'
      });
    }

    const atributos = {};

    if (fecha !== undefined)
      atributos.Fecha = fecha;

    if (totalVenta !== undefined)
      atributos.TotalVenta = totalVenta;

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos a actualizar'
      });
    }

    const filas = await PedidoModel.updatePedido(id, atributos);
    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Pedido actualizado'
    });
  } catch (error) {
    console.error('Error al actualizar datos del pedido: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar datos del pedido'
    });
  }
}

// DELETE /api/pedido/:id
const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const filas = await PedidoModel.deletePedido(id);

    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Pedido eliminado'
    });
  } catch (error) {
    console.error('Error al eliminar pedido: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar pedido'
    });
  }
}

module.exports = {
  getPedidos,
  getPedidoById,
  getPedidosAggregate,
  getPedidosWithJoin,
  createPedido,
  updatePedido,
  deletePedido
};
