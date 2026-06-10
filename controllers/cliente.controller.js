const ClienteModel = require('../model/Cliente');

// GET /api/clientes
const getClientes = async (req, res) => {
  try {
    const clientes = await ClienteModel.getClientes();
    res.json({
      success: true,
      clientes
    });
  } catch (error) {
    console.error('Error al obtener clientes: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes.'
    });
  }
}

// GET /api/clientes/:id
const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await ClienteModel.getClienteById(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      success: true,
      cliente
    });
  } catch (error) {
    console.error('Error al obtener cliente por ID: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cliente por ID.'
    });
  }
}

module.exports = {
  getClientes,
  getClienteById
}
