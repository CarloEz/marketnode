const router= require('express').Router();
const ctrl= require('../controllers/empleado.controller');

router.post('/',ctrl.saveEmp);
router.get('/',ctrl.getEmpleados);
router.delete('/:id',ctrl.delete);
router.post('/login',ctrl.login);
router.post('/empresa',ctrl.empresa);
router.get('/empresa',ctrl.getEmpresa);
router.get('/countEmpleados',ctrl.cantidadEmp);

module.exports=router;