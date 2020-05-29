const router = require('express').Router();
const ctrl = require('../controllers/compras.controller');

router.post('/',ctrl.save);

module.exports= router;