const IngredienteModel = require('../model/Ingrediente');

// GET /api/ingrediente
const getIngredientes = async (req, res) => {
  try {
    const ingredientes = await IngredienteModel.getIngredientes();
    res.json({
      success: true,
      ingredientes
    });
  } catch (error) {
    console.error('Error al obtener ingredientes: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ingredientes.'
    });
  }
}

// GET /api/ingrediente/:id
const getIngredienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const ingrediente = await IngredienteModel.getIngredienteById(id);

    if (!ingrediente) {
      return res.status(404).json({
        success: false,
        message: 'Ingrediente no encontrado'
      });
    }

    res.json({
      success: true,
      ingrediente
    });
  } catch (error) {
    console.error('Error al obtener ingrediente por ID: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ingrediente por ID.'
    });
  }
}

// GET /api/ingrediente/project
const getIngredienteProyeccion = async (req, res) => {
  try {
    const { campos, stockMin, stockMax } = req.query;

    if (!campos) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere de al menos un campo a proyectar'
      });
    }

    const camposPermitidos = ['idIngrediente', 'nombre', 'unidadMedida', 'stockActual', 'IdProveedor'];
    const camposConsultados = campos.split(',').map(f => f.trim());

    // Validar si existe dicho campo
    const camposNoValidos = camposConsultados.filter(f => !camposPermitidos.includes(f));
    if (camposNoValidos.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campos inválidos: ${camposNoValidos.join(', ')}`
      });
    }

    if (stockMin && stockMax && stockMin > stockMax) {
      return res.status(400).json({
        success: false,
        message: 'stockMin no puede ser mayor que stockMax'
      });
    }

    const result = await IngredienteModel.getIngredienteProyeccion(
      camposConsultados, { stockMin, stockMax }
    );

    res.status(200).json({
      success: true,
      datos: result
    });
  } catch (error) {
    console.error('Error al obtener ingredientes: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ingredientes'
    });
  }
};

// POST /api/ingrediente
const createIngrediente = async (req, res) => {
  try {
    const { idIngrediente, nombre, unidad, stock, idProveedor } = req.body;

    if (!idIngrediente || !nombre || !unidad || !stock || !idProveedor) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos obligatorios'
      });
    }

    const insertId = await IngredienteModel.createIngrediente(idIngrediente, nombre, unidad, stock, idProveedor);
    res.status(201).json({
      success: true,
      message: 'Se agregó el ingrediente',
      insertId
    });
  } catch (error) {
    console.error('Error al añadir ingrediente: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al añadir ingrediente'
    });
  }
};

// PUT /api/ingrediente/:id
const updateIngrediente = async (req, res) => {
  try {
    const { idIngrediente } = req.params;
    const { nombre, unidad, stock, idProveedor } = req.body;

    if (!idIngrediente || isNaN(idIngrediente)) {
      return res.status(400).json({
        success: false,
        message: 'ID de ingrediente no válido'
      });
    }

    if (!idProveedor || isNaN(idProveedor)) {
      return res.status(400).json({
        success: false,
        message: 'ID de proveedor no válido'
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

    if (unidad !== undefined)
      atributos.UnidadMedida = unidad;

    if (stock !== undefined)
      atributos.StockActual = stock;

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos a actualizar'
      });
    }

    const filas = await IngredienteModel.updateIngrediente(id, atributos);
    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ingrediente no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Ingrediente actualizado'
    });
  } catch (error) {
    console.error('Error al actualizar datos del ingrediente: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar datos del ingrediente'
    });
  }
}

// DELETE /api/ingrediente/:id
const deleteIngrediente = async (req, res) => {
  try {
    const { id } = req.params;
    const filas = await IngredienteModel.deleteIngrediente(id);

    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ingrediente no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Ingrediente eliminado'
    });
  } catch (error) {
    console.error('Error al eliminar ingrediente: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar ingrediente'
    });
  }
}

module.exports = {
  getIngredientes,
  getIngredienteById,
  getIngredienteProyeccion,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente
};
