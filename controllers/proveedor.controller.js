const ProveedorModel = require('../model/Proveedor');

// GET /api/proveedor
const getProveedores = async (req, res) => {
  try {
    const proveedores = await ProveedorModel.getProveedores();
    res.json({
      success: true,
      proveedores
    });
  } catch (error) {
    console.error('Error al obtener proveedores: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proveedores.'
    });
  }
}

// GET /api/proveedor/:id
const getProveedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await ProveedorModel.getProveedorById(id);

    if (!proveedor) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }

    res.json({
      success: true,
      proveedor
    });
  } catch (error) {
    console.error('Error al obtener proveedor por ID: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proveedor por ID.'
    });
  }
}

// POST /api/proveedor
const createProveedor = async (req, res) => {
  try {
    const { id, nombre, telefono, ciudad } = req.body;

    if (!id || !nombre || !telefono || !ciudad) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos obligatorios'
      });
    }

    const insertId = await ProveedorModel.createProveedor(id, nombre, telefono, ciudad);
    res.status(201).json({
      success: true,
      message: 'Se agregó el proveedor',
      insertId
    });
  } catch (error) {
    console.error('Error al añadir proveedor: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al añadir proveedor'
    });
  }
};

// PUT /api/proveedor/:id
const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, ciudad } = req.body;

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

    if (telefono !== undefined)
      atributos.Telefono = telefono;

    if (ciudad !== undefined)
      atributos.Ciudad = ciudad;

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos a actualizar'
      });
    }

    const filas = await ProveedorModel.updateProveedor(id, atributos);
    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Proveedor actualizado'
    });
  } catch (error) {
    console.error('Error al actualizar datos del proveedor: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar datos del proveedor'
    });
  }
}

// DELETE /api/proveedor/:id
const deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const filas = await ProveedorModel.deleteProveedor(id);

    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Proveedor eliminado'
    });
  } catch (error) {
    console.error('Error al eliminar proveedor: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar proveedor'
    });
  }
}

module.exports = {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor
};
