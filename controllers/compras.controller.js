//compras,deuda proveedor.
let conn = require('./connection.controller');

let ctrl = {};

let deudasProveedor=async()=>{
    let sql=``;
    let parameters=[];
    let result = conn.getquery(sql,parameters);
    return result;
}

ctrl.save = async (req, res) => {
    res.json("JAJA");
    /*
    let date = new Date();
    let sql = `Call RegistrarCompras(?,?,?,?,?,?,?,?,?,?)`;
    let parameters = [req.body.Id_Empleado, req.body.Id_Proveedor, req.body.ProductosComprados, date.toISOString().substring(0, 10), req.body.credito, req.body.TotalCompra, req.body.Id_FacturaCompras, req.body.SerieFacturaCompras, req.body.FechaFacturaCompras, 0];
    let result = await conn.getquery(sql, parameters);
    
    let success = true;
    
    if (result.errno) {
        success = false;
        res.json({ res: { error: result.errno, desc: result.code } });
    } else {
        if (req.body.credito == 1) {
            //let credito = await ventasCredito(req.body.id_cliente, result[0][0].Id_Venta, req.body.total, req.body.TazaInteres, Fecha.toISOString().substring(0, 10));
        }
        req.body.detalleVenta.forEach(async (fila) => {
            let resultado = await detalleVenta(fila, result[0][0].Id_Venta);
            if (resultado.errno) {
                success = false;
                res.json({ res: { error: resultado.errno, desc: resultado.code } });
            }
        });
        if (success) { res.json({ res: "Venta registrada" }) }
    }
    */
}

ctrl.spr = async (req, res) => {
    let sql = ``;
    res.json("Compras")
}

let detalleCompra = async (fila) => {
    let sql = `Call RegistrarDetalleCompra(?,?,?,?,?,?,?)`;
    let paramateres = [req.body.Id_Producto, req.body.Id_Compra, req.body.CantidadIngresada, req.body.PrecioCostoDC, req.body.FechaVencimiento, req.body.TotalDetalleCompra, 0];
    let result = await conn.getquery(sql, parameters);
}

let disminuirDeuda = async (req, res) => {
    let sql = ``;
    let parameters = [];
    let result = await conn.getquery(sql, parameters);
    req.json(result);
}

let aumentarDeuda = async (req, res) => {
    let sql = ``;
    let parameters = [];
    let result = await conn.getquery(sql, parameters);
    req.json(result);
}

module.exports = ctrl;