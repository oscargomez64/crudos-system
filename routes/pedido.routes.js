const express = require('express');
const router = express.Router();
const {
  getPedidos,
  getPedidoById,
  getPedidosAggregate,
  getPedidosWithJoin,
  createPedido,
  updatePedido,
  deletePedido
} = require('../controllers/pedido.controller');

router.get('/', getPedidosWithJoin);
router.get('/all', getPedidos);
router.get('/aggregate', getPedidosAggregate);
router.get('/:id', getPedidoById);

// Group by cliente with sum of total sales and count of orders
// GET /api/pedidos/aggregate?groupBy=cliente&aggregates=totalComprado:sum,count:count

// Get clients with total sales greater than 1000
// GET /api/pedidos/aggregate?groupBy=cliente&aggregates=totalComprado:sum&having=totalComprado:gt:1000

// Join pedidos with cliente, get specific fields
// GET /api/pedidos?join=cliente&fields=cliente.nombre,pedido.fecha,pedido.totalVenta

router.post('/', createPedido);
router.put('/:id', updatePedido);
router.delete('/:id', deletePedido);

module.exports = router;
