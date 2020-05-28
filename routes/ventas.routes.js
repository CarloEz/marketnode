const router=require('Express').Router();
const ctrl=require('../controllers/ventas.controller');

router.get('/',ctrl.obtenerVentas);
router.post('/',ctrl.saveVenta);
router.get('/:id_cliente',ctrl.getVentasCliente);
router.delete('/:id',ctrl.suprVenta);
router.post('/abono',ctrl.saveAbono);
router.get('/creditos/all',ctrl.getCreditos);
router.get('/creditos/:id_cliente',ctrl.getCredito);
router.get('/cliente/abonos/:id_credito',ctrl.getAbonos);
router.delete('/cliente/abonos/:id',ctrl.suprAbono);
router.get('/cliente/:id_cliente/:serie_fact', ctrl.buyClient);

module.exports= router;