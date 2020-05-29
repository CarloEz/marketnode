const router = require('express').Router();
const ctrl = require('../controllers/compras.controller');

router.get('/',ctrl.save);

module.exports= router;