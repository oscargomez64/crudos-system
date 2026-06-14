const express = require('express');
const router = express.Router();
const {
  getIngredientes,
  getIngredienteById,
  getIngredienteProyeccion,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente
} = require('../controllers/ingrediente.controller');

router.get('/', getIngredientes);
router.get('/project', getIngredienteProyeccion);
router.get('/:id', getIngredienteById);

router.post('/', createIngrediente);
router.put('/:id', updateIngrediente);
router.delete('/:id', deleteIngrediente);

module.exports = router;
