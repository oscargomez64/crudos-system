const ClienteModel = require('../model/Cliente');
const { isMissing, isValidId } = require('./helpers');

const CAMPOS_PERMITIDOS = ['idCliente', 'nombre', 'rfc', 'ciudad', 'tipoCliente'];
const TIPOS_VALIDOS = ['Mayorista', 'Minorista'];

function parseCampos(campos) {
  return campos.split(',').map((field) => field.trim()).filter(Boolean);
}

const getClientes = async (req, res) => {
  try {
    const clientes = await ClienteModel.getClientes();
    res.status(200).json({ success: true, data: clientes });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ success: false, message: 'Error al obtener clientes.' });
  }
};

const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de cliente no valido.' });
    }

    const cliente = await ClienteModel.getClienteById(id);

    if (!cliente) {
      return res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
    }

    res.status(200).json({ success: true, data: cliente });
  } catch (error) {
    console.error('Error al obtener cliente por ID:', error);
    res.status(500).json({ success: false, message: 'Error al obtener cliente por ID.' });
  }
};

const getClientesProyeccion = async (req, res) => {
  try {
    const { campos, tipoCliente } = req.query;

    if (isMissing(campos)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere al menos un campo a proyectar.'
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

    if (!isMissing(tipoCliente) && !TIPOS_VALIDOS.includes(tipoCliente)) {
      return res.status(400).json({
        success: false,
        message: 'tipoCliente debe ser Mayorista o Minorista.'
      });
    }

    const result = await ClienteModel.getClientesProyeccion(camposConsultados, tipoCliente);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error al proyectar clientes:', error);
    res.status(500).json({ success: false, message: 'Error al proyectar clientes.' });
  }
};

const createCliente = async (req, res) => {
  try {
    const id = req.body.idCliente ?? req.body.id;
    const tipoCliente = req.body.tipoCliente ?? req.body.tipo;
    const { nombre, rfc, ciudad } = req.body;

    if ([id, nombre, rfc, ciudad, tipoCliente].some(isMissing)) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
    }

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de cliente no valido.' });
    }

    if (!TIPOS_VALIDOS.includes(tipoCliente)) {
      return res.status(400).json({
        success: false,
        message: 'tipoCliente debe ser Mayorista o Minorista.'
      });
    }

    await ClienteModel.createCliente(id, nombre, rfc, ciudad, tipoCliente);
    res.status(201).json({
      success: true,
      message: 'Cliente creado correctamente.',
      data: { idCliente: Number(id) }
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ success: false, message: 'Error al crear cliente.' });
  }
};

const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const tipoCliente = req.body.tipoCliente ?? req.body.tipo;
    const { nombre, rfc, ciudad } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de cliente no valido.' });
    }

    const atributos = {};

    if (!isMissing(nombre)) {
      atributos.Nombre = nombre;
    }

    if (!isMissing(rfc)) {
      atributos.RFC = rfc;
    }

    if (!isMissing(ciudad)) {
      atributos.Ciudad = ciudad;
    }

    if (!isMissing(tipoCliente)) {
      if (!TIPOS_VALIDOS.includes(tipoCliente)) {
        return res.status(400).json({
          success: false,
          message: 'tipoCliente debe ser Mayorista o Minorista.'
        });
      }
      atributos.TipoCliente = tipoCliente;
    }

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos a actualizar.' });
    }

    const filas = await ClienteModel.updateCliente(id, atributos);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Cliente actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar cliente.' });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de cliente no valido.' });
    }

    const filas = await ClienteModel.deleteCliente(id);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Cliente eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar cliente.' });
  }
};

module.exports = {
  getClientes,
  getClienteById,
  getClientesProyeccion,
  createCliente,
  updateCliente,
  deleteCliente
};
