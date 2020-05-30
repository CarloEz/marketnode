//compras,deuda proveedor.
let conn = require('./connection.controller');
let ctrl = {};

//Arreglar compras 
ctrl.save = async (req, res) => {
    let date = new Date();
    let sql = `Call RegistrarCompras(?,?,?,?,?,?,?,?,?,?)`;
    let parameters = [req.body.Id_Empleado, req.body.Id_Proveedor, req.body.ProductosComprados, date.toISOString().substring(0, 10), req.body.credito, req.body.TotalCompra, req.body.Id_FacturaCompras, req.body.SerieFacturaCompras, req.body.FechaFacturaCompras, 0];
    let result = await conn.getquery(sql, parameters);
    let success = true;
    
    if (result.errno) {
        success = false;
        res.json({ res: { error: result.errno, desc: result.code } });
    } else {
        req.body.detallecompra.forEach(async (fila) => {
            let resultado = await detalleCompra(fila, result[0][0].Id_Compra);
            if (resultado.errno) {
                success = false;
                res.json({ res: { error: resultado.errno, desc: resultado.code } });
            }
        });
        if (success) { res.json({ res: "Venta registrada" }) }
    }
}

ctrl.spr = async (req, res) => {
    let sql = ``;
    res.json("Compras")
}

let detalleCompra = async (fila,Id_Compra) => {
    let sql = `Call RegistrarDetalleCompra(?,?,?,?,?,?,?)`;
    let paramateres = [fila.Id_Producto, Id_Compra, fila.CantidadIngresada, fila.PrecioCostoDC, fila.FechaVencimiento, fila.TotalDetalleCompra, 0];
    let result = await conn.getquery(sql, parameters);
}

module.exports = ctrl;