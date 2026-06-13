const PedidoCervezaModel = require('../model/Pedido_Cerveza');

// GET /api/pedido_cerveza/all
const getPedidoCerveza = async (req, res) => {
  try {
    const pedidoCerveza = await PedidoCervezaModel.getPedidoCerveza();
    res.json({
      success: true,
      pedidoCerveza
    });
  } catch (error) {
    console.error('Error al obtener pedido de cerveza: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedido de cerveza.'
    });
  }
}

// GET /api/pedido_cerveza?idPedido=x&idCerveza=y
const getPedidoCervezaById = async (req, res) => {
  try {
    const { idPedido, idCerveza } = req.query;
    const pedidoCerveza = await PedidoCervezaModel.getPedidoCervezaById(idPedido, idCerveza);

    if (!pedidoCerveza) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      pedidoCerveza
    });
  } catch (error) {
    console.error('Error al obtener pedido de cerveza por IDs: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedido de cerveza por IDs.'
    });
  }
}

// POST /api/pedido_cerveza
const createPedidoCerveza = async (req, res) => {
  try {
    const { idPedido, idCerveza, cantidadLitros, precioUnitario } = req.body;

    if (!idPedido || !idCerveza || !cantidadLitros || !precioUnitario) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos obligatorios'
      });
    }

    const insertId = await PedidoCervezaModel.createPedidoCerveza(idPedido, idCerveza, cantidadLitros, precioUnitario);
    res.status(201).json({
      success: true,
      message: 'Se agregó el pedido de cerveza',
      insertId
    });
  } catch (error) {
    console.error('Error al añadir pedido de cerveza: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al añadir pedido de cerveza'
    });
  }
};

// PUT /api/pedido_cerveza?idPedido=x&idCerveza=y
const updatePedidoCerveza = async (req, res) => {
  try {
    const { idPedido, idCerveza } = req.query;
    const { cantidadLitros, precioUnitario } = req.body;

    if (!idPedido || isNaN(idPedido)) {
      return res.status(400).json({
        success: false,
        message: 'ID de pedido no válido'
      });
    }

    if (!idCerveza || isNaN(idCerveza)) {
      return res.status(400).json({
        success: false,
        message: 'ID de cerveza no válida'
      });
    }

    const atributos = {};

    if (cantidadLitros !== undefined)
      atributos.CantidadLitros = cantidadLitros;

    if (precioUnitario !== undefined)
      atributos.PrecioUnitario = precioUnitario;

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos a actualizar'
      });
    }

    const filas = await PedidoCervezaModel.updatePedidoCerveza(idPedido, idCerveza, atributos);
    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido de cerveza no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Pedido de cerveza actualizado'
    });
  } catch (error) {
    console.error('Error al actualizar datos del pedido de cerveza: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar datos del pedido de cerveza'
    });
  }
}

// DELETE /api/pedido_cerveza?idPedido=x&idCerveza=y
const deletePedidoCerveza = async (req, res) => {
  try {
    const { idPedido, idCerveza } = req.query;
    const filas = await PedidoCervezaModel.deletePedidoCerveza(idPedido, idCerveza);

    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido de cerveza no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Pedido de cerveza eliminado'
    });
  } catch (error) {
    console.error('Error al eliminar pedido de cerveza: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar pedido de cerveza'
    });
  }
}

module.exports = {
  getPedidoCerveza,
  getPedidoCervezaById,
  createPedidoCerveza,
  updatePedidoCerveza,
  deletePedidoCerveza
};
