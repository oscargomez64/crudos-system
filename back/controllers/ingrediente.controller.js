const IngredienteModel = require('../model/Ingrediente');
const { isMissing, isValidId, parseOptionalNumber, parseRequiredNumber } = require('./helpers');

const CAMPOS_PERMITIDOS = ['idIngrediente', 'nombre', 'unidadMedida', 'stockActual', 'idProveedor'];

function parseCampos(campos) {
  return campos.split(',').map((field) => field.trim()).filter(Boolean);
}

const getIngredientes = async (req, res) => {
  try {
    const ingredientes = await IngredienteModel.getIngredientes();
    res.status(200).json({ success: true, data: ingredientes });
  } catch (error) {
    console.error('Error al obtener ingredientes:', error);
    res.status(500).json({ success: false, message: 'Error al obtener ingredientes.' });
  }
};

const getIngredienteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de ingrediente no valido.' });
    }

    const ingrediente = await IngredienteModel.getIngredienteById(id);

    if (!ingrediente) {
      return res.status(404).json({ success: false, message: 'Ingrediente no encontrado.' });
    }

    res.status(200).json({ success: true, data: ingrediente });
  } catch (error) {
    console.error('Error al obtener ingrediente por ID:', error);
    res.status(500).json({ success: false, message: 'Error al obtener ingrediente por ID.' });
  }
};

const getIngredienteProyeccion = async (req, res) => {
  try {
    const { campos } = req.query;
    const stockMin = parseOptionalNumber(req.query.stockMin, 'stockMin');
    const stockMax = parseOptionalNumber(req.query.stockMax, 'stockMax');

    if (isMissing(campos)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere al menos un campo a proyectar.'
      });
    }

    if (stockMin !== undefined && stockMax !== undefined && stockMin > stockMax) {
      return res.status(400).json({
        success: false,
        message: 'stockMin no puede ser mayor que stockMax.'
      });
    }

    const camposConsultados = parseCampos(campos);
    const camposNoValidos = camposConsultados.filter((field) => !CAMPOS_PERMITIDOS.includes(field));

    if (camposConsultados.length === 0 || camposNoValidos.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campos no permitidos: ${camposNoValidos.join(', ') || campos}`
      });
    }

    const result = await IngredienteModel.getIngredienteProyeccion(
      camposConsultados,
      { stockMin, stockMax }
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error al proyectar ingredientes:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al proyectar ingredientes.' });
  }
};

const createIngrediente = async (req, res) => {
  try {
    const { idIngrediente, nombre, unidad, unidadMedida, stock, stockActual, idProveedor } = req.body;
    const unidadValue = unidadMedida ?? unidad;
    const stockValue = stockActual ?? stock;

    if ([idIngrediente, nombre, unidadValue, stockValue, idProveedor].some(isMissing)) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
    }

    if (!isValidId(idIngrediente) || !isValidId(idProveedor)) {
      return res.status(400).json({
        success: false,
        message: 'ID de ingrediente o proveedor no valido.'
      });
    }

    const stockNumber = parseRequiredNumber(stockValue, 'stockActual');

    await IngredienteModel.createIngrediente(idIngrediente, nombre, unidadValue, stockNumber, idProveedor);
    res.status(201).json({
      success: true,
      message: 'Ingrediente creado correctamente.',
      data: { idIngrediente: Number(idIngrediente) }
    });
  } catch (error) {
    console.error('Error al crear ingrediente:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al crear ingrediente.' });
  }
};

const updateIngrediente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, unidad, unidadMedida, stock, stockActual, idProveedor } = req.body;
    const unidadValue = unidadMedida ?? unidad;
    const stockValue = stockActual ?? stock;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de ingrediente no valido.' });
    }

    const atributos = {};

    if (!isMissing(nombre)) {
      atributos.Nombre = nombre;
    }

    if (!isMissing(unidadValue)) {
      atributos.UnidadMedida = unidadValue;
    }

    if (!isMissing(stockValue)) {
      atributos.StockActual = parseRequiredNumber(stockValue, 'stockActual');
    }

    if (!isMissing(idProveedor)) {
      if (!isValidId(idProveedor)) {
        return res.status(400).json({ success: false, message: 'ID de proveedor no valido.' });
      }
      atributos.IdProveedor = idProveedor;
    }

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos a actualizar.' });
    }

    const filas = await IngredienteModel.updateIngrediente(id, atributos);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Ingrediente no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Ingrediente actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar ingrediente:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al actualizar ingrediente.' });
  }
};

const deleteIngrediente = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de ingrediente no valido.' });
    }

    const filas = await IngredienteModel.deleteIngrediente(id);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Ingrediente no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Ingrediente eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar ingrediente:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar ingrediente.' });
  }
};

module.exports = {
  getIngredientes,
  getIngredienteById,
  getIngredienteProyeccion,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente
};
