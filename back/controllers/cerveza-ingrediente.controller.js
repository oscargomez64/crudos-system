const CervezaIngredienteModel = require('../model/Cerveza_Ingrediente');
const { isMissing, isValidId, parseRequiredNumber } = require('./helpers');

function getCompositeIds(req) {
  return {
    idCerveza: req.query.idCerveza ?? req.body.idCerveza,
    idIngrediente: req.query.idIngrediente ?? req.body.idIngrediente
  };
}

const getCervezaIngredientes = async (req, res) => {
  try {
    const cervezaIngredientes = await CervezaIngredienteModel.getCervezaIngredientes();
    res.status(200).json({ success: true, data: cervezaIngredientes });
  } catch (error) {
    console.error('Error al obtener relaciones cerveza-ingrediente:', error);
    res.status(500).json({ success: false, message: 'Error al obtener relaciones cerveza-ingrediente.' });
  }
};

const getCervezaIngredienteById = async (req, res) => {
  try {
    const { idCerveza, idIngrediente } = getCompositeIds(req);

    if (!isValidId(idCerveza) || !isValidId(idIngrediente)) {
      return res.status(400).json({
        success: false,
        message: 'idCerveza e idIngrediente son obligatorios y deben ser validos.'
      });
    }

    const cervezaIngrediente = await CervezaIngredienteModel.getCervezaIngredienteById(idCerveza, idIngrediente);

    if (!cervezaIngrediente) {
      return res.status(404).json({ success: false, message: 'Relacion cerveza-ingrediente no encontrada.' });
    }

    res.status(200).json({ success: true, data: cervezaIngrediente });
  } catch (error) {
    console.error('Error al obtener relacion cerveza-ingrediente:', error);
    res.status(500).json({ success: false, message: 'Error al obtener relacion cerveza-ingrediente.' });
  }
};

const createCervezaIngrediente = async (req, res) => {
  try {
    const { idCerveza, idIngrediente, cantidadRequerida } = req.body;

    if ([idCerveza, idIngrediente, cantidadRequerida].some(isMissing)) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
    }

    if (!isValidId(idCerveza) || !isValidId(idIngrediente)) {
      return res.status(400).json({
        success: false,
        message: 'idCerveza e idIngrediente deben ser validos.'
      });
    }

    const cantidad = parseRequiredNumber(cantidadRequerida, 'cantidadRequerida');

    await CervezaIngredienteModel.createCervezaIngrediente(idCerveza, idIngrediente, cantidad);
    res.status(201).json({
      success: true,
      message: 'Relacion cerveza-ingrediente creada correctamente.',
      data: { idCerveza: Number(idCerveza), idIngrediente: Number(idIngrediente) }
    });
  } catch (error) {
    console.error('Error al crear relacion cerveza-ingrediente:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al crear relacion cerveza-ingrediente.' });
  }
};

const updateCervezaIngrediente = async (req, res) => {
  try {
    const { idCerveza, idIngrediente } = getCompositeIds(req);
    const { cantidadRequerida } = req.body;

    if (!isValidId(idCerveza) || !isValidId(idIngrediente)) {
      return res.status(400).json({
        success: false,
        message: 'idCerveza e idIngrediente son obligatorios y deben ser validos.'
      });
    }

    const atributos = {};

    if (!isMissing(cantidadRequerida)) {
      atributos.CantidadRequerida = parseRequiredNumber(cantidadRequerida, 'cantidadRequerida');
    }

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos a actualizar.' });
    }

    const filas = await CervezaIngredienteModel.updateCervezaIngrediente(idCerveza, idIngrediente, atributos);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Relacion cerveza-ingrediente no encontrada.' });
    }

    res.status(200).json({ success: true, message: 'Relacion cerveza-ingrediente actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar relacion cerveza-ingrediente:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al actualizar relacion cerveza-ingrediente.' });
  }
};

const deleteCervezaIngrediente = async (req, res) => {
  try {
    const { idCerveza, idIngrediente } = getCompositeIds(req);

    if (!isValidId(idCerveza) || !isValidId(idIngrediente)) {
      return res.status(400).json({
        success: false,
        message: 'idCerveza e idIngrediente son obligatorios y deben ser validos.'
      });
    }

    const filas = await CervezaIngredienteModel.deleteCervezaIngrediente(idCerveza, idIngrediente);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Relacion cerveza-ingrediente no encontrada.' });
    }

    res.status(200).json({ success: true, message: 'Relacion cerveza-ingrediente eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar relacion cerveza-ingrediente:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar relacion cerveza-ingrediente.' });
  }
};

module.exports = {
  getCervezaIngredientes,
  getCervezaIngredienteById,
  createCervezaIngrediente,
  updateCervezaIngrediente,
  deleteCervezaIngrediente
};
