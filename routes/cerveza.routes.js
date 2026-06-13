const express = require('express');
const router = express.Router();
const {
  getCerveza,
  getCervezaById,
  createCerveza,
  updateCerveza,
  deleteCerveza
} = require('../controllers/cerveza.controller');

router.get('/', getCerveza);
router.get('/:id', getCervezaById);

router.post('/', createCerveza);
router.put('/:id', updateCerveza);
router.delete('/:id', deleteCerveza);

module.exports = router;
