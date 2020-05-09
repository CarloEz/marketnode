const router= require('express').Router();
const ctrl= require('../controllers/producto.controlles');

router.post('/cat',ctrl.saveCat);
router.delete('/delete/categoria/:id',ctrl.deleteCat);

router.get('/:term',ctrl.search);

module.exports=router;