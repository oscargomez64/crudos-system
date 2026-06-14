const CervezaModel = require('../model/Cerveza');
const { isMissing, isValidId, parseOptionalNumber, parseRequiredNumber } = require('./helpers');

const CAMPOS_PERMITIDOS = ['idCerveza', 'nombre', 'estilo', 'gradoAlcohol', 'precioLitro'];

function parseCampos(campos) {
  return campos.split(',').map((field) => field.trim()).filter(Boolean);
}

const getCerveza = async (req, res) => {
  try {
    const cervezas = await CervezaModel.getCerveza();
    res.status(200).json({ success: true, data: cervezas });
  } catch (error) {
    console.error('Error al obtener cervezas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener cervezas.' });
  }
};

const getCervezaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de cerveza no valido.' });
    }

    const cerveza = await CervezaModel.getCervezaById(id);

    if (!cerveza) {
      return res.status(404).json({ success: false, message: 'Cerveza no encontrada.' });
    }

    res.status(200).json({ success: true, data: cerveza });
  } catch (error) {
    console.error('Error al obtener cerveza por ID:', error);
    res.status(500).json({ success: false, message: 'Error al obtener cerveza por ID.' });
  }
};

const getCervezaProyeccion = async (req, res) => {
  try {
    const { campos } = req.query;
    const gradoMin = parseOptionalNumber(req.query.gradoMin, 'gradoMin');
    const gradoMax = parseOptionalNumber(req.query.gradoMax, 'gradoMax');

    if (isMissing(campos)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere al menos un campo a proyectar.'
      });
    }

    if (gradoMin !== undefined && gradoMax !== undefined && gradoMin > gradoMax) {
      return res.status(400).json({
        success: false,
        message: 'gradoMin no puede ser mayor que gradoMax.'
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

    const result = await CervezaModel.getCervezaProyeccion(
      camposConsultados,
      { gradoMin, gradoMax }
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error al proyectar cervezas:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al proyectar cervezas.' });
  }
};

const createCerveza = async (req, res) => {
  try {
    const id = req.body.idCerveza ?? req.body.id;
    const grado = req.body.gradoAlcohol ?? req.body.grado;
    const precio = req.body.precioLitro ?? req.body.precio;
    const { nombre, estilo } = req.body;

    if ([id, nombre, estilo, grado, precio].some(isMissing)) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
    }

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de cerveza no valido.' });
    }

    const gradoNumber = parseRequiredNumber(grado, 'gradoAlcohol');
    const precioNumber = parseRequiredNumber(precio, 'precioLitro');

    await CervezaModel.createCerveza(id, nombre, estilo, gradoNumber, precioNumber);
    res.status(201).json({
      success: true,
      message: 'Cerveza creada correctamente.',
      data: { idCerveza: Number(id) }
    });
  } catch (error) {
    console.error('Error al crear cerveza:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al crear cerveza.' });
  }
};

const updateCerveza = async (req, res) => {
  try {
    const { id } = req.params;
    const grado = req.body.gradoAlcohol ?? req.body.grado;
    const precio = req.body.precioLitro ?? req.body.precio;
    const { nombre, estilo } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de cerveza no valido.' });
    }

    const atributos = {};

    if (!isMissing(nombre)) {
      atributos.Nombre = nombre;
    }

    if (!isMissing(estilo)) {
      atributos.Estilo = estilo;
    }

    if (!isMissing(grado)) {
      atributos.GradoAlcohol = parseRequiredNumber(grado, 'gradoAlcohol');
    }

    if (!isMissing(precio)) {
      atributos.PrecioLitro = parseRequiredNumber(precio, 'precioLitro');
    }

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos a actualizar.' });
    }

    const filas = await CervezaModel.updateCerveza(id, atributos);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Cerveza no encontrada.' });
    }

    res.status(200).json({ success: true, message: 'Cerveza actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar cerveza:', error);
    res.status(400).json({ success: false, message: error.message || 'Error al actualizar cerveza.' });
  }
};

const deleteCerveza = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de cerveza no valido.' });
    }

    const filas = await CervezaModel.deleteCerveza(id);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Cerveza no encontrada.' });
    }

    res.status(200).json({ success: true, message: 'Cerveza eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar cerveza:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar cerveza.' });
  }
};

module.exports = {
  getCerveza,
  getCervezaById,
  getCervezaProyeccion,
  createCerveza,
  updateCerveza,
  deleteCerveza
};
