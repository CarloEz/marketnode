const router= require('express').Router();
const ctrl= require('../controllers/empleado.controller');

router.post('/',ctrl.saveEmp);

router.delete('/:id',ctrl.delete);

router.post('/login',ctrl.login);


module.exports=router;