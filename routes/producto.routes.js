const router= require('express').Router();
const ctrl= require('../controllers/producto.controlles');

//CATEGORIA
router.post('/cat',ctrl.saveCat);
router.delete('/delete/categoria/:id',ctrl.deleteCat);
router.get('/cat',ctrl.getCat);

//PRODUCTOS
router.get('/count',ctrl.cantidadProducts);
router.post('/existencia/add',ctrl.addProd);
router.post('/existencia/del',ctrl.deleteProd);
router.post('/token/',ctrl.saveproducto);
router.get('/:term',ctrl.searchProd);
router.get('/',ctrl.getProducts);
router.delete('/delete/:id',ctrl.delete);

//PROVEEDOR
router.post('/proveedor',ctrl.saveProv);
router.get('/obteniendo/proveedores',ctrl.getProveedores);
router.get('/proveedores/count',ctrl.cantidadProveedores);
router.delete('/proveedores/:id',ctrl.deleteProv);

module.exports=router;