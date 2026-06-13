const express = require('express');
const router = express.Router();
const {
  getPedidoCerveza,
  getPedidoCervezaById,
  createPedidoCerveza,
  updatePedidoCerveza,
  deletePedidoCerveza
} = require('../controllers/pedido-cerveza.controller');

router.get('/', getPedidoCervezaById);
router.get('/all', getPedidoCerveza);

router.post('/', createPedidoCerveza);
router.put('/', updatePedidoCerveza);
router.delete('/', deletePedidoCerveza);

module.exports = router;
