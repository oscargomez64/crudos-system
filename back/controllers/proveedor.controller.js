const ProveedorModel = require('../model/Proveedor');
const { isMissing, isValidId } = require('./helpers');

const CAMPOS_PERMITIDOS = ['idProveedor', 'nombre', 'telefono', 'ciudad'];

function parseCampos(campos) {
  return campos.split(',').map((field) => field.trim()).filter(Boolean);
}

const getProveedores = async (req, res) => {
  try {
    const proveedores = await ProveedorModel.getProveedores();
    res.status(200).json({ success: true, data: proveedores });
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ success: false, message: 'Error al obtener proveedores.' });
  }
};

const getProveedorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de proveedor no valido.' });
    }

    const proveedor = await ProveedorModel.getProveedorById(id);

    if (!proveedor) {
      return res.status(404).json({ success: false, message: 'Proveedor no encontrado.' });
    }

    res.status(200).json({ success: true, data: proveedor });
  } catch (error) {
    console.error('Error al obtener proveedor por ID:', error);
    res.status(500).json({ success: false, message: 'Error al obtener proveedor por ID.' });
  }
};

const getProveedoresProyeccion = async (req, res) => {
  try {
    const { campos, ciudad } = req.query;

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

    const result = await ProveedorModel.getProveedoresProyeccion(camposConsultados, ciudad);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error al proyectar proveedores:', error);
    res.status(500).json({ success: false, message: 'Error al proyectar proveedores.' });
  }
};

const createProveedor = async (req, res) => {
  try {
    const id = req.body.idProveedor ?? req.body.id;
    const { nombre, telefono, ciudad } = req.body;

    if ([id, nombre, telefono, ciudad].some(isMissing)) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
    }

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de proveedor no valido.' });
    }

    await ProveedorModel.createProveedor(id, nombre, telefono, ciudad);
    res.status(201).json({
      success: true,
      message: 'Proveedor creado correctamente.',
      data: { idProveedor: Number(id) }
    });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ success: false, message: 'Error al crear proveedor.' });
  }
};

const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, ciudad } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de proveedor no valido.' });
    }

    const atributos = {};

    if (!isMissing(nombre)) {
      atributos.Nombre = nombre;
    }

    if (!isMissing(telefono)) {
      atributos.Telefono = telefono;
    }

    if (!isMissing(ciudad)) {
      atributos.Ciudad = ciudad;
    }

    if (Object.keys(atributos).length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos a actualizar.' });
    }

    const filas = await ProveedorModel.updateProveedor(id, atributos);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Proveedor no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Proveedor actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar proveedor.' });
  }
};

const deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de proveedor no valido.' });
    }

    const filas = await ProveedorModel.deleteProveedor(id);

    if (filas === 0) {
      return res.status(404).json({ success: false, message: 'Proveedor no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Proveedor eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar proveedor.' });
  }
};

module.exports = {
  getProveedores,
  getProveedorById,
  getProveedoresProyeccion,
  createProveedor,
  updateProveedor,
  deleteProveedor
};
