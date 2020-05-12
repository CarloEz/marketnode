const router= require('express').Router();
const ctrl= require('../controllers/producto.controlles');
const multer= require('multer');
let upload=multer({dest:'./public/products/'})

//CATEGORIA
router.post('/cat',ctrl.saveCat);
router.delete('/delete/categoria/:id',ctrl.deleteCat);

//PRODUCTOS
router.post('/existencia/add',ctrl.addProd);
router.post('/existencia/del',ctrl.deleteProd);
router.post('/',upload.single('img'),ctrl.save);
router.get('/:term',ctrl.searchProd);

//PROVEEDOR

module.exports=router;