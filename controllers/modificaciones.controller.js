let conn= require('./connection.controller');
let ctrl={};

ctrl.disminuirProducto = async (fila) => {
    let sql = `update Producto set ExistenciaProducto=(ExistenciaProducto-${fila.cantidad}) where Id_Producto=${fila.id_producto}`;
    let result = await conn.getquery(sql);
    return result;
}

ctrl.aumentarProducto = async (fila) => {
    let sql = `update Producto set ExistenciaProducto=(ExistenciaProducto+${fila.CantidadProducto}) where Id_Producto=${fila.Id_Producto}`;
    let result = await conn.getquery(sql);
    return result;
}

module.exports=ctrl;