const express = require('express');
const router = express.Router();
const {
  getCervezaIngredientes,
  getCervezaIngredienteById,
  createCervezaIngrediente,
  updateCervezaIngrediente,
  deleteCervezaIngrediente
} = require('../controllers/cerveza-ingrediente.controller');

router.get('/', getCervezaIngredienteById);
router.get('/all', getCervezaIngredientes);

router.post('/', createCervezaIngrediente);
router.put('/', updateCervezaIngrediente);
router.delete('/', deleteCervezaIngrediente);

module.exports = router;
