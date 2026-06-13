const CervezaModel = require('../model/Cerveza');

// GET /api/cerveza
const getCerveza = async (req, res) => {
  try {
    const cervezas = await CervezaModel.getCerveza();
    res.json({
      success: true,
      cervezas
    });
  } catch (error) {
    console.error('Error al obtener cervezas: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cervezas.'
    });
  }
}

// GET /api/cerveza/:id
const getCervezaById = async (req, res) => {
  try {
    const { id } = req.params;
    const cerveza = await CervezaModel.getCervezaById(id);

    if (!cerveza) {
      return res.status(404).json({
        success: false,
        message: 'Cerveza no encontrada'
      });
    }

    res.json({
      success: true,
      cerveza
    });
  } catch (error) {
    console.error('Error al obtener cerveza por ID: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cerveza por ID.'
    });
  }
}

// POST /api/cerveza
const createCerveza = async (req, res) => {
  try {
    const { id, nombre, estilo, grado, precio } = req.body;

    if (!id || !nombre || !estilo || !grado || !precio) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos obligatorios'
      });
    }

    const insertId = await CervezaModel.createCerveza(id, nombre, estilo, grado, precio);
    res.status(201).json({
      success: true,
      message: 'Se agregó la cerveza',
      insertId
    });
  } catch (error) {
    console.error('Error al añadir cerveza: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al añadir cerveza'
    });
  }
};

// PUT /api/cerveza/:id
const updateCerveza = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, estilo, grado, precio } = req.body;

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

    if (estilo !== undefined)
      atributos.estilo = estilo;

    if (grado !== undefined)
      atributos.GradoAlcohol = grado;

    if (precio !== undefined)
      atributos.PrecioLitro = precio;

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos a actualizar'
      });
    }

    const filas = await CervezaModel.updateCerveza(id, atributos);
    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cerveza no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Cerveza actualizada'
    });
  } catch (error) {
    console.error('Error al actualizar datos de la cerveza: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar datos de la cerveza'
    });
  }
}

// DELETE /api/cerveza/:id
const deleteCerveza = async (req, res) => {
  try {
    const { id } = req.params;
    const filas = await CervezaModel.deleteCerveza(id);

    if (filas === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cerveza no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Cerveza eliminada'
    });
  } catch (error) {
    console.error('Error al eliminar cerveza: ', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cerveza'
    });
  }
}

module.exports = {
  getCerveza,
  getCervezaById,
  createCerveza,
  updateCerveza,
  deleteCerveza
};
