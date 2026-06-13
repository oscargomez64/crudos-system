const CervezaIngredienteModel = require('../model/Cerveza_Ingrediente');

// GET /api/cerveza_ingrediente/all
const getCervezaIngredientes = async (req, res) => {
  try {
    const cervezaIngredientes = await CervezaIngredienteModel.getCervezaIngredientes();
    res.json({
      success: true,
      cervezaIngredientes
    });
  } catch (error) {
    console.error('Error al obtener ingredientes de cerveza: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ingredientes de cerveza.'
    });
  }
}

// GET /api/cerveza_ingrediente?idCerveza=x&idIngrediente=y
const getCervezaIngredienteById = async (req, res) => {
  try {
    const { idCerveza, idIngrediente } = req.query;
    const cervezaIngrediente = await CervezaIngredienteModel.getCervezaIngredienteById(idCerveza, idIngrediente);

    if (!cervezaIngrediente) {
      return res.status(404).json({
        success: false,
        message: 'Ingrediente de cerveza no encontrado'
      });
    }

    res.json({
      success: true,
      cervezaIngrediente
    });
  } catch (error) {
    console.error('Error al obtener ingrediente de cerveza por IDs: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ingrediente de cerveza por IDs.'
    });
  }
}

// POST /api/cerveza_ingrediente
const createCervezaIngrediente = async (req, res) => {
  try {
    const { idCerveza, idIngrediente, cantidadRequerida } = req.body;

    if (!idCerveza || !idIngrediente || !cantidadRequerida) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos obligatorios'
      });
    }

    const insertId = await CervezaIngredienteModel.createCervezaIngrediente(idCerveza, idIngrediente, cantidadRequerida);
    res.status(201).json({
      success: true,
      message: 'Se agregó relación de ingrediente cerveza',
      insertId
    });
  } catch (error) {
    console.error('Error al añadir relación de ingrediente cerveza: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al añadir relación de ingrediente cerveza'
    });
  }
};

// PUT /api/cerveza_ingrediente?idCerveza=x&idIngrediente=y
const updateCervezaIngrediente = async (req, res) => {
  try {
    const { idCerveza, idIngrediente } = req.query;
    const { cantidadRequerida } = req.body;

    
    if (!idCerveza || isNaN(idCerveza)) {
      return res.status(400).json({
        success: false,
        message: 'ID de cerveza no válida'
      });
    }
    
    if (!idIngrediente || isNaN(idIngrediente)) {
      return res.status(400).json({
        success: false,
        message: 'ID de ingrediente no válido'
      });
    }

    const atributos = {};
    
    if (cantidadRequerida !== undefined)
      atributos.CantidadRequerida = cantidadRequerida;

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos a actualizar'
      });
    }

    const filas = await CervezaIngredienteModel.updateCervezaIngrediente(idCerveza, idIngrediente, atributos);
    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Relación cerveza ingrediente no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Relación cerveza ingrediente actualizado'
    });
  } catch (error) {
    console.error('Error al actualizar datos de relación cerveza ingrediente: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar datos de relación cerveza ingrediente'
    });
  }
}

// DELETE /api/cerveza_ingrediente?idCerveza=x&idIngrediente=y
const deleteCervezaIngrediente = async (req, res) => {
  try {
    const { idCerveza, idIngrediente } = req.query;
    const filas = await CervezaIngredienteModel.deleteCervezaIngrediente(idCerveza, idIngrediente);

    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Relación cerveza ingrediente no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Relación cerveza ingrediente eliminado'
    });
  } catch (error) {
    console.error('Error al eliminar relación cerveza ingrediente: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar relación cerveza ingrediente'
    });
  }
}

module.exports = {
  getCervezaIngredientes,
  getCervezaIngredienteById,
  createCervezaIngrediente,
  updateCervezaIngrediente,
  deleteCervezaIngrediente
};
