const PedidoCervezaModel = require('../model/Pedido_Cerveza');
const { isMissing, isValidId, parseRequiredNumber } = require('./helpers');

function getCompositeIds(req) {
  return {
    idPedido: req.query.idPedido ?? req.body.idPedido,
    idCerveza: req.query.idCerveza ?? req.body.idCerveza
  };
}

const getPedidoCerveza = async (req, res) => {
  try {
    const pedidoCerveza = await PedidoCervezaModel.getPedidoCerveza();
    res.status(200).json({ success: true, data: pedidoCerveza });
  } catch (error) {
    console.error('Error al obtener relaciones pedido-cerveza:', error);
    res.status(500).json({ success: false, message: 'Error al obtener relaciones pedido-cerveza.' });
  }
};

const getPedidoCervezaById = async (req, res) => {
  try {
    const { idPedido, idCerveza } = getCompositeIds(req);

    if (!isValidId(idPedido) || !isValidId(idCerveza)) {
      return res.status(400).json({
        success: false,
        message: 'idPedido e idCerveza son obligatorios y deben ser validos.'
      });
    }

    const pedidoCerveza = await PedidoCervezaModel.getPedidoCervezaById(idPedido, idCerveza);

    if (!pedidoCerveza) {
      return res.status(404).json({ success: false, message: 'Relacion pedido-cerveza no encontrada.' });
    }

    res.status(200).json({ success: true, data: pedidoCerveza });
  } catch (error) {
    console.error('Error al obtener relacion pedido-cerveza:', error);
    res.status(500).json({ success: false, message: 'Error al obtener relacion pedido-cerveza.' });
  }
};

const createPedidoCerveza = async (req, res) => {
  try {
    const { idPedido, idCerveza, cantidadLitros } = req.body;
    const precioUnitarioAplicado = req.body.precioUnitarioAplicado ?? req.body.precioUnitario;

    if ([idPedido, idCerveza, cantidadLitros, precioUnitarioAplicado].some(isMissing)) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
    }

    if (!isValidId(idPedido) || !isValidId(idCerveza)) {
      return res.status(400).json({
        success: false,
        message: 'idPedido e idCerveza deben ser validos.'
      });
    }

    const cantidad = parseRequiredNumber(cantidadLitros, 'cantidadLitros');
    const precio = parseRequiredNumber(precioUnitarioAplicado, 'precioUnitarioAplicado');

    await PedidoCervezaModel.createPedidoCerveza(idPedido, idCerveza, cantidad, precio);
    res.status(201).json({
      success: true,
      message: 'Relacion pedido-cerveza creada correctamente.',
      data: { idPedido: Number(idPedido), idCerveza: Number(idCerveza) }
    });
  } catch (error) {
    console.error('Error al crear relacion pedido-cerveza:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al crear relacion pedido-cerveza.' });
  }
};

const updatePedidoCerveza = async (req, res) => {
  try {
    const { idPedido, idCerveza } = getCompositeIds(req);
    const { cantidadLitros } = req.body;
    const precioUnitarioAplicado = req.body.precioUnitarioAplicado ?? req.body.precioUnitario;

    if (!isValidId(idPedido) || !isValidId(idCerveza)) {
      return res.status(400).json({
        success: false,
        message: 'idPedido e idCerveza son obligatorios y deben ser validos.'
      });
    }

    const atributos = {};

    if (!isMissing(cantidadLitros)) {
      atributos.CantidadLitros = parseRequiredNumber(cantidadLitros, 'cantidadLitros');
    }

    if (!isMissing(precioUnitarioAplicado)) {
      atributos.PrecioUnitarioAplicado = parseRequiredNumber(precioUnitarioAplicado, 'precioUnitarioAplicado');
    }

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos a actualizar.' });
    }

    const filas = await PedidoCervezaModel.updatePedidoCerveza(idPedido, idCerveza, atributos);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Relacion pedido-cerveza no encontrada.' });
    }

    res.status(200).json({ success: true, message: 'Relacion pedido-cerveza actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar relacion pedido-cerveza:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al actualizar relacion pedido-cerveza.' });
  }
};

const deletePedidoCerveza = async (req, res) => {
  try {
    const { idPedido, idCerveza } = getCompositeIds(req);

    if (!isValidId(idPedido) || !isValidId(idCerveza)) {
      return res.status(400).json({
        success: false,
        message: 'idPedido e idCerveza son obligatorios y deben ser validos.'
      });
    }

    const filas = await PedidoCervezaModel.deletePedidoCerveza(idPedido, idCerveza);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Relacion pedido-cerveza no encontrada.' });
    }

    res.status(200).json({ success: true, message: 'Relacion pedido-cerveza eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar relacion pedido-cerveza:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar relacion pedido-cerveza.' });
  }
};

module.exports = {
  getPedidoCerveza,
  getPedidoCervezaById,
  createPedidoCerveza,
  updatePedidoCerveza,
  deletePedidoCerveza
};
