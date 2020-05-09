const router= require('express').Router();
const ctrl= require('../controllers/cliente.controller');

router.post('/tipo/',ctrl.saveTipo);
router.delete('/tipo/:id',ctrl.deleteTipo);

router.post('/',ctrl.save);
router.delete('/:id',ctrl.delete);

router.post('/login',ctrl.login);


module.exports=router;