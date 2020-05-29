//compras,deuda proveedor.
let conn = require('./connection.controller');

let ctrl = {};

ctrl.save = async (req, res) => {
    let sql = `Call RegistrarCompras(?,?,?,?,?,?,?,?,?,?)`;
    let parameters = [req.body.Id_Empleado, req.body.Id_Proveedor, req.body.ProductosComprados, req.body.FechaCompra, req.body.TipoCompra, req.body.TotalCompra, req.body.Id_FacturaCompras, req.body.SerieFacturaCompras, req.body.FechaFacturaCompras, 0]
    let result = await conn.getquery(sql, parameters);
    (result.errno) ? res.json(result.errno) : res.json('Compra registrada');
}

ctrl.spr = async (req, res) => {
    let sql = ``;
    res.json("Compras")
}

let detalleCompra = async (fila) => {
    let sql = `Call RegistrarDetalleCompra(?,?,?,?,?,?,?)`;
    let paramateres = [req.body.Id_Producto,req.body.Id_Compra,req.body.CantidadIngresada,req.body.PrecioCostoDC,req.body.FechaVencimiento,req.body.TotalDetalleCompra,0];
    let result = await conn.getquery(sql, parameters);

}

let disminuirDeuda=async(req,res)=>{
    let sql=``;
    let parameters=[];
    let result= await conn.getquery(sql,parameters);
    req.json(result);
}


let aumentarDeuda=async(req,res)=>{
let sql=``;
let parameters=[];
let result= await conn.getquery(sql,parameters);
req.json(result);
}

module.exports = ctrl;