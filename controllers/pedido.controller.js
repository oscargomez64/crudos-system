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
  createPedido,
  updatePedido,
  deletePedido
};
