const PedidoModel = require('../model/Pedido');
const { isMissing, isValidId, parseRequiredNumber } = require('./helpers');

const JOIN_ALLOWED_FIELDS = {
  cliente: ['idCliente', 'nombre', 'rfc', 'ciudad', 'tipoCliente'],
  pedido: ['idPedido', 'fecha', 'totalVenta', 'idCliente']
};

const GROUP_BY_FIELDS = ['cliente', 'tipoCliente', 'fecha'];
const AGGREGATE_FIELDS = ['totalComprado', 'totalVenta', 'count'];
const AGGREGATE_FUNCTIONS = ['SUM', 'COUNT', 'AVG', 'MIN', 'MAX'];
const HAVING_OPERATORS = ['gt', 'gte', 'lt', 'lte', 'eq', 'ne'];

function parseList(value) {
  return value.split(',').map((field) => field.trim()).filter(Boolean);
}

const getPedidos = async (req, res) => {
  try {
    const pedidos = await PedidoModel.getPedidos();
    res.status(200).json({ success: true, data: pedidos });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener pedidos.' });
  }
};

const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de pedido no valido.' });
    }

    const pedido = await PedidoModel.getPedidoById(id);

    if (!pedido) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado.' });
    }

    res.status(200).json({ success: true, data: pedido });
  } catch (error) {
    console.error('Error al obtener pedido por ID:', error);
    res.status(500).json({ success: false, message: 'Error al obtener pedido por ID.' });
  }
};

const getPedidosAggregate = async (req, res) => {
  try {
    const { groupBy, aggregates, having } = req.query;

    if (isMissing(groupBy) || isMissing(aggregates)) {
      return res.status(400).json({
        success: false,
        message: 'groupBy y aggregates son obligatorios.'
      });
    }

    if (!GROUP_BY_FIELDS.includes(groupBy)) {
      return res.status(400).json({
        success: false,
        message: `groupBy no permitido: ${groupBy}`
      });
    }

    const aggregateList = parseList(aggregates).map((agg) => {
      const [field, func] = agg.split(':').map((part) => part.trim());
      return { field, func: String(func || '').toUpperCase() };
    });

    if (aggregateList.length === 0 || aggregateList.some((agg) => !agg.field || !agg.func)) {
      return res.status(400).json({
        success: false,
        message: 'aggregates debe tener formato campo:funcion.'
      });
    }

    const invalidAggs = aggregateList.filter((agg) => (
      !AGGREGATE_FIELDS.includes(agg.field) || !AGGREGATE_FUNCTIONS.includes(agg.func)
    ));

    if (invalidAggs.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Agregados no permitidos: ${invalidAggs.map((agg) => `${agg.field}:${agg.func}`).join(', ')}`
      });
    }

    let havingCondition = null;

    if (!isMissing(having)) {
      const [field, operator, value] = having.split(':').map((part) => part.trim());
      const aggregateFields = aggregateList.map((agg) => agg.field);
      const numericValue = Number(value);

      if (!aggregateFields.includes(field) || !HAVING_OPERATORS.includes(operator) || !Number.isFinite(numericValue)) {
        return res.status(400).json({
          success: false,
          message: 'having debe tener formato agregado:operador:valor y usar un agregado solicitado.'
        });
      }

      havingCondition = { field, operator, value: numericValue };
    }

    const resultado = await PedidoModel.getAggregate(groupBy, aggregateList, havingCondition);
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    console.error('Error al obtener agregados de pedidos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener agregados de pedidos.' });
  }
};

const getPedidosWithJoin = async (req, res) => {
  try {
    const { join, fields } = req.query;

    if (isMissing(join) && isMissing(fields)) {
      const pedidos = await PedidoModel.getPedidosWithJoin(null, []);
      return res.status(200).json({ success: true, data: pedidos });
    }

    if (join !== 'cliente') {
      return res.status(400).json({
        success: false,
        message: 'Solo se permite join=cliente.'
      });
    }

    if (isMissing(fields)) {
      return res.status(400).json({
        success: false,
        message: 'fields es obligatorio cuando se usa join.'
      });
    }

    const fieldList = parseList(fields);
    const invalidFields = fieldList.filter((field) => {
      const [table, column] = field.split('.');
      return !JOIN_ALLOWED_FIELDS[table] || !JOIN_ALLOWED_FIELDS[table].includes(column);
    });

    if (fieldList.length === 0 || invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campos no permitidos: ${invalidFields.join(', ') || fields}`
      });
    }

    const resultado = await PedidoModel.getPedidosWithJoin(join, fieldList);
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    console.error('Error al obtener pedidos con join:', error);
    res.status(500).json({ success: false, message: 'Error al obtener pedidos con join.' });
  }
};

const createPedido = async (req, res) => {
  try {
    const { idPedido, fecha, totalVenta, idCliente } = req.body;

    if ([idPedido, fecha, totalVenta, idCliente].some(isMissing)) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
    }

    if (!isValidId(idPedido) || !isValidId(idCliente)) {
      return res.status(400).json({
        success: false,
        message: 'ID de pedido o cliente no valido.'
      });
    }

    const totalVentaNumber = parseRequiredNumber(totalVenta, 'totalVenta');

    await PedidoModel.createPedido(idPedido, fecha, totalVentaNumber, idCliente);
    res.status(201).json({
      success: true,
      message: 'Pedido creado correctamente.',
      data: { idPedido: Number(idPedido) }
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al crear pedido.' });
  }
};

const updatePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, totalVenta, idCliente } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de pedido no valido.' });
    }

    const atributos = {};

    if (!isMissing(fecha)) {
      atributos.Fecha = fecha;
    }

    if (!isMissing(totalVenta)) {
      atributos.TotalVenta = parseRequiredNumber(totalVenta, 'totalVenta');
    }

    if (!isMissing(idCliente)) {
      if (!isValidId(idCliente)) {
        return res.status(400).json({ success: false, message: 'ID de cliente no valido.' });
      }
      atributos.IdCliente = idCliente;
    }

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos a actualizar.' });
    }

    const filas = await PedidoModel.updatePedido(id, atributos);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Pedido actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al actualizar pedido.' });
  }
};

const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de pedido no valido.' });
    }

    const filas = await PedidoModel.deletePedido(id);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Pedido eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar pedido.' });
  }
};

module.exports = {
  getPedidos,
  getPedidoById,
  getPedidosAggregate,
  getPedidosWithJoin,
  createPedido,
  updatePedido,
  deletePedido
};
