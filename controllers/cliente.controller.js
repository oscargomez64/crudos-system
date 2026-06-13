const ClienteModel = require('../model/Cliente');

// GET /api/cliente
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

// GET /api/cliente/:id
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

// GET /api/cliente/project
const getClientesProyeccion = async (req, res) => {
  try {
    const { campos, tipoCliente } = req.query;

    if (!campos) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere de al menos un campo a proyectar'
      });
    }

    const camposPermitidos = ['idCliente', 'nombre', 'rfc', 'ciudad', 'tipoCliente'];
    const camposConsultados = campos.split(',').map(f => f.trim());

    // Validar si existe dicho campo
    const camposNoValidos = camposConsultados.filter(f => !camposPermitidos.includes(f));
    if (camposNoValidos.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campos inválidos: ${camposNoValidos.join(', ')}`
      });
    }

    const tiposValidos = ['Mayorista', 'Minorista'];

    if (tipoCliente && !tiposValidos.includes(tipoCliente)) {
      return res.status(400).json({
        success: false,
        message: 'Cliente debe ser tipo Mayorista O Minorista'
      });
    }

    const result = await ClienteModel.getClientesProyeccion(camposConsultados, tipoCliente);

    res.status(200).json({
      success: true,
      datos: result
    });
  } catch (error) {
    console.error('Error al obtener clientes: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes'
    });
  }
};

// POST /api/cliente
const createCliente = async (req, res) => {
  try {
    const { id, nombre, rfc, ciudad, tipo } = req.body;

    if (!id || !nombre || !rfc || !ciudad || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos obligatorios'
      });
    }

    const insertId = await ClienteModel.createCliente(id, nombre, rfc, ciudad, tipo);
    res.status(201).json({
      success: true,
      message: 'Se agregó el cliente',
      insertId
    });
  } catch (error) {
    console.error('Error al añadir cliente: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al añadir cliente'
    });
  }
};

// PUT /api/cliente/:id
const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, rfc, ciudad, tipoCliente } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID no válido'
      });
    }

    const atributos = {};

    if (nombre !== undefined) {
      if (typeof nombre != 'string' || nombre.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'El nombre debe ser una cadena válida'
        });
      }
      atributos.nombre = nombre;
    }

    if (rfc !== undefined) {
      if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc)) {
        return res.status(400).json({
          success: false,
          message: 'RFC inválido'
        });
      }
      atributos.rfc = rfc;
    }

    if (ciudad !== undefined)
      atributos.ciudad = ciudad;

    if (tipoCliente !== undefined)
      atributos.tipoCliente = tipoCliente;

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos a actualizar'
      });
    }

    const filas = await ClienteModel.updateCliente(id, atributos);
    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Cliente actualizado'
    });
  } catch (error) {
    console.error('Error al actualizar datos del cliente: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar datos del cliente'
    });
  }
}

// DELETE /api/cliente/:id
const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const filas = await ClienteModel.deleteCliente(id);

    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Cliente eliminado'
    });
  } catch (error) {
    console.error('Error al eliminar cliente: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cliente'
    });
  }
}

module.exports = {
  getClientes,
  getClienteById,
  getClientesProyeccion,
  createCliente,
  updateCliente,
  deleteCliente
};
