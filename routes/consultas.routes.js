const express = require('express');
const router = express.Router();
const {
  getVentasPorCliente,
  getLitrosPorCerveza,
  getIngredientesPorProveedor,
  getClientesComprasMayores1000,
  getCervezasMas10Litros,
  getProveedoresMasUnIngrediente,
  getPedidosClientes,
  getDetallePedidos,
  getIngredientesProveedor,
  getCervezasClientesGuadalajara
} = require('../controllers/consultas.controller');

router.get('/agrupadas/ventas-por-cliente', getVentasPorCliente);
router.get('/agrupadas/litros-por-cerveza', getLitrosPorCerveza);
router.get('/agrupadas/ingredientes-por-proveedor', getIngredientesPorProveedor);

router.get('/having/clientes-compras-mayores-1000', getClientesComprasMayores1000);
router.get('/having/cervezas-mas-10-litros', getCervezasMas10Litros);
router.get('/having/proveedores-mas-un-ingrediente', getProveedoresMasUnIngrediente);

router.get('/multitabla/pedidos-clientes', getPedidosClientes);
router.get('/multitabla/detalle-pedidos', getDetallePedidos);
router.get('/multitabla/ingredientes-proveedor', getIngredientesProveedor);
router.get('/multitabla/cervezas-clientes-guadalajara', getCervezasClientesGuadalajara);

module.exports = router;
