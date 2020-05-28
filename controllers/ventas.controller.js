let conn = require('./connection.controller');
let ctrl = {};

let detalleVenta = async (fila, id_venta) => {
    let sql = 'CALL RegistrarDetalleVenta(?,?,?,?,?,?)';
    let parameters = [id_venta, fila.id_producto, fila.cantidad, fila.precio_u, fila.total_detalle, 0];
    let result = await conn.getquery(sql, parameters);

    if (result.errno) {
        return result;
    } else {
        return await disminuirProducto(fila);
    }
}

let disminuirProducto = async (fila) => {
    let sql = `update Producto set ExistenciaProducto=(ExistenciaProducto-${fila.cantidad}) where Id_Producto=${fila.id_producto}`;
    let result = await conn.getquery(sql);
    return result;
}

let seleccionarDetalleVenta = async (id_venta) => {
    let sql = `Select * from DetalleVenta where Id_Venta=\'${id_venta}\'`;
    let result = await conn.getquery(sql);
    return result;
}

let aumentarProducto = async (fila) => {
    let sql = `update Producto set ExistenciaProducto=(ExistenciaProducto+${fila.CantidadProducto}) where Id_Producto=${fila.Id_Producto}`;
    let result = await conn.getquery(sql);
    return result;
}

ctrl.buyClient = async (req, res) => {
    const sql = `CALL ConsultarCompraCliente(?,?)`;
    const parameters = [req.params.id_cliente, req.params.serie_fact];
    const result = await conn.getquery(sql, parameters);
    res.json({ res: result[0] });
}

let aumentarCredito=async(totalVenta,fecha,Id_Credito)=>{
    let sql=(fecha==null) 
    ? `update Credito set Cantidad=Cantidad+${totalVenta} where Id_Credito=${Id_Credito}`
    : `update Credito set Cantidad=Cantidad+${totalVenta}, FechaLimite=\'${fecha}\' where Id_Credito=${Id_Credito}`;
    
    let result=await conn.getquery(sql);
    console.log("aumentar credito ",result);
    return result;
}

let disminuirCredito=async(CuotaAbono,Id_Credito)=>{
    let actualizar=`update Credito set Cantidad=Cantidad-${CuotaAbono} where Id_Credito=${Id_Credito}`;
    let result=await conn.getquery(actualizar);
    return result;
}

//A la hora de hacer la venta al credito se verifica si existe una cuenta del cliente sino se tiene que crear una.
let saveCredito = async (Id_Cliente,TazaInteres,FechaLimite) => {
    let sql = `CALL RegistrarCredito(?,?,?,?,?)`;
    let parameters =[Id_Cliente,TazaInteres,0,FechaLimite,0];    
    console.log("PARAMETERS:",parameters);
    let result = await conn.getquery(sql, parameters);
    console.log("REsultado savecredito",result);
    return result;
}

//Arreglar ventas credito.
let ventasCredito=async(id_cliente,Id_Venta,totalVenta,TazaInteres,FechaLimite)=>{
    console.log("FECHA LIMITE_",FechaLimite);
    let sql=`Select Id_Credito from Credito where Id_Cliente=${id_cliente}`;   
    let result=await conn.getquery(sql); 
    console.log("72 Resultado ",result);   
    let parameters;

    if(result.length==0){
        await saveCredito(id_cliente,TazaInteres,FechaLimite);
        await aumentarCredito(totalVenta,FechaLimite,resultado[0][0].Id_Credito);
        parameters=[resultado[0][0].Id_Credito,Id_Venta];
    }else{ 
        let otro= await aumentarCredito(totalVenta,FechaLimite,result[0].Id_Credito);     
        console.log("+credito ",otro," id_credito ",result[0].Id_Credito);
        parameters=[result[0].Id_Credito,Id_Venta];
    }

    sql=`Insert into VentasCredito(Id_Credito,Id_Venta) values(?,?)`;    
    let credito= await conn.getquery(sql,parameters);
    console.log("84credito: ",credito);
    return credito
}

ctrl.getCreditos=async(req,res)=>{
    let sql="Select * from Credito where EliminarCredito=\'0\'";
    let result= await conn.getquery(sql);
    res.json({res:result});
}

ctrl.getCredito=async(req,res)=>{
    let sql=`Select * from Credito where EliminarCredito=0 and Id_Cliente=${req.params.id_cliente}`;
    let result=await conn.getquery(sql);
    res.json({res:result});
}

ctrl.getAbonos=async(req,res)=>{
    let sql=`Select a.Id_Abonos, a.CuotaAbono, a.FechaAbono from AbonosCredito ab inner join Abonos a on ab.Id_Abonos=a.Id_Abonos where ab.Id_Credito=\'${req.params.id_credito}\'`;
    let id_abonos=await conn.getquery(sql);
    res.json({res:id_abonos});
}

ctrl.saveAbono= async(req,res)=>{
    let sql='CALL RegistrarAbonos(?,?,?)';
    let date= new Date();
    
    parameters=[req.body.CuotaAbono, date.toISOString().substring(0,10), 0];
    let result= await conn.getquery(sql,parameters);
    if(result.errno){
        res.json({ res: { error: result.errno, desc: result.code } });
    }else{
        await disminuirCredito(req.body.CuotaAbono,req.body.Id_Credito);
        result =await DetalleAbono(req.body.Id_Credito,result[0][0].Id_Abonos);
        let respuesta = (result.errno) ? { res: { error: result.errno, desc: "No existe este id Credito" } } : {res:"Abono Registrado"}
        res.json(respuesta);
    }
}

let DetalleAbono=async(id_Credito,id_Abonos)=>{
    let sql='Insert into AbonosCredito(Id_Credito,Id_Abonos) values(?,?)';
    let parameters=[id_Credito,id_Abonos];
    
    let result= await conn.getquery(sql,parameters);
    return result;
}

ctrl.suprAbono = async (req, res) => {
    let selectAbono=`Select a.CuotaAbono,ac.Id_Credito from Abonos a inner join AbonosCredito ac on ac.Id_Abonos=a.Id_Abonos where a.Id_Abonos=${req.params.id}`;
    let fila=await conn.getquery(selectAbono);
    let sql = `CALL EliminarAbonos(${req.params.id})`;
    let result = await conn.getquery(sql);
    if(result.errno){
        res.json({ res: { error: result.errno, desc: result.code } });
    }else{
        await aumentarCredito(fila[0].CuotaAbono,null,fila[0].Id_Credito);
        res.json({res:"Abono eliminado"})
    }
}

ctrl.saveVenta = async (req, res) => {
    let date= new Date();
    let sql = 'CALL RegistrarVenta(?,?,?,?,?,?,?,?,?)';
    let parameters = [req.body.id_cliente, 1, req.body.credito, req.body.productos_vendidos,date.toISOString().substring(0,10), req.body.total, req.body.id_factura, req.body.serie_factura, 0];
    let result = await conn.getquery(sql, parameters);
    let success=true;
    let Fecha= new Date(req.body.FechaLimite);
    
    if (result.errno) {
        success=false;
        res.json({ res: { error: result.errno, desc: result.code }});
    } else {
        if(req.body.credito==1){
          let credito=await ventasCredito(req.body.id_cliente,result[0][0].Id_Venta,req.body.total,req.body.TazaInteres,Fecha.toISOString().substring(0,10));
        }
        req.body.detalleVenta.forEach(async (fila) => {
            let resultado = await detalleVenta(fila, result[0][0].Id_Venta);
            if(resultado.errno){
                success=false;
                res.json({ res: { error: resultado.errno, desc: resultado.code } });
            }
        });
        if(success){res.json({res:"Venta registrada"})}
    }
}

ctrl.getVentasCliente=async(req,res)=>{
    let sql=`Select v.Id_Venta, v.Id_Cliente, v.Id_DatoEmpresa, v.TipoVenta, v.ProductosVendidos, v.FechaVenta, v.TotalVenta, v.Id_facturaVenta, v.SerieFacturaVenta from Venta v inner join VentasCredito vc on vc.Id_Venta=v.Id_Venta where v.Id_Cliente=${req.params.id_cliente}`;
    let result= await conn.getquery(sql);
    res.json({res:result});    
}

ctrl.obtenerVentas = async (req, res) => {
    let sql = 'Select * from Venta where EliminarVenta=0';
    let result = await conn.getquery(sql);
    if (result.errno) {
        res.json({ res: { error: result.errno, desc: result.code } })
    } else {
        res.json({ res: result })
    }
}

let suprDetalleCompletoVenta = async (id_venta) => {
    let result = await seleccionarDetalleVenta(id_venta);

    if (result.length === 0) {
        return result = { errno: "1", code: "No existe detalle de venta" };
    } else {
        result.forEach(async (fila) => {
            let result = await aumentarProducto(fila);
            if (result.errno) {
                return result;
            } else {
                let sql = `CALL EliminaDetalleVenta(?)`;
                result = await conn.getquery(sql, fila.Id_DetalleVenta);
                if (result.errno) { return result };
            }
        })
        return result = { res: "Detalle eliminado" };
    }
}

ctrl.suprVenta = async (req, res) => {
    let result = await suprDetalleCompletoVenta(req.params.id);
    let obtenerVenta=`Select v.TotalVenta, v.TipoVenta, vc.Id_Credito from Venta v inner join VentasCredito vc on vc.Id_Venta=v.Id_Venta where v.Id_Venta=${req.params.id}`; 
    let fila= await conn.getquery(obtenerVenta);
    
    if (result.errno) {
        res.json({ res: { error: result.errno, desc: result.code } });
    } else {

        if(fila.length>0 && fila[0].TipoVenta==1){
            await disminuirCredito(fila[0].TotalVenta,fila[0].Id_Credito);
        }

        let sql = `CALL EliminarVenta(?)`;
        result = await conn.getquery(sql, req.params.id);
        if (result.errno) {
            res.json({ res: { error: result.errno, desc: result.code } });
        } else {
            res.json({ res: "Venta eliminada" });
        }
    }
}

module.exports = ctrl;