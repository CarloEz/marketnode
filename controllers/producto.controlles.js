const mariadb= require('../db');
const fs=require('fs');
const path= require('path');
let ctrl={};

let getquery=async(query,parameters=null)=>{
    try{
        let conn= await mariadb.getConn();
        const result= await conn.query(query,parameters);
        conn.end();
        return result;
    }
    catch(err){
        return err;
    }
}
//CATEGORIA PRODUCTOS
ctrl.saveCat=async(req,res)=>{
    let sql='CALL RegistrarCategoriaProducto(?,?)';
    let parameters=[req.body.categoria,0];
    let result=await getquery(sql,parameters);
    res.status(200).json({res:result});
}

ctrl.deleteCat=async(req,res)=>{
    let sql='CALL EliminarCategoriaProducto(?)';
    let result=await getquery(sql,req.params.id);
    res.status(200).json({res:result});
}

ctrl.getCat=async(req,res)=>{
    let sql='Select * from CategoriaProducto where EliminarCategoria=0';
    let result=await getquery(sql);
    res.status(200).json({res:result});
}

//PRODUCTOS
ctrl.cantidadProducts= async(req,res)=>{
    let sql='SELECT COUNT(NombreProducto) as numero from Producto where EliminarProducto=0';
    let result=await getquery(sql);
    res.json(result[0]);
}

ctrl.getProducts=async(req,res)=>{
    let sql='Select * from Producto where EliminarProducto=0';
    let result= await getquery(sql);
    res.status(200).json({res:result});   
}

ctrl.addProd=async(req,res)=>{
    req.body.cantidad
    let sql=`update Producto set ExistenciaProducto=(ExistenciaProducto+${req.body.cantidad}) where NombreProducto=\'${req.body.product}\'`;
    let result= await getquery(sql);
    res.json(result);
}

ctrl.deleteProd= async(req,res)=>{
    let sql=`update Producto set ExistenciaProducto=(ExistenciaProducto-${req.body.cantidad}) where NombreProducto=\'${req.body.product}\'`;
    let result= await getquery(sql);
    res.json(result);
}

ctrl.delete= async(req,res)=>{
    let sql='Call  EliminaProducto(?)';
    let result=await getquery(sql,req.params.id);

    if(result.errno){
        res.json({res:{err:result.errno,descripcion:result.code}})
    }else{
        res.json({res:"Producto Eliminado"});
    }
}

ctrl.save=async(req,res)=>{
    let Imgname=null;
    if(req.file){
        const ext= path.extname(req.file.originalname);
        Imgname=req.file.filename+ext;
        fs.renameSync(req.file.path, './public/products/' + Imgname);
    }

    let sql=`Insert into Producto(Id_Empleado,Id_CategoriaProducto,Imagen,NombreProducto,Precio,Costo,MarcaProducto,Descripcion,ExistenciaProducto,Vencidos,Presentacion,UnidadMedida,EliminarProducto) values(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    let parameters=[req.body.idemp,req.body.idcat,Imgname,req.body.producto,req.body.precio,req.body.costo,req.body.marca,req.body.descripcion,req.body.cantidad,req.body.vencidos,req.body.presentacion,req.body.unidadMedida,0];
    let result=await getquery(sql,parameters);
    if(result.errno){
        res.json({res:{error:result.errno,desc:result.code}})
    }else{
        res.status(200).json({res:'Ingresado correctamente'})
    }
}

ctrl.searchProd=async(req,res)=>{
    let save=`SELECT * FROM Producto WHERE NombreProducto LIKE \'${req.params.term}%\'`;
    const result= await getquery(save);
    res.status(200).json(result);
}

//PROVEEDORES
ctrl.saveProv=async(req,res)=>{
    let sql='Insert into Proveedor(NombreProveedor,ApellidoProveedor,CorreoProveedor,TelefonoProveedor,NitProveedor,EliminarProveedor) values(?,?,?,?,?,?)';
    let parameters=[req.body.name,req.body.secname,req.body.correo,req.body.tel,req.body.nit,0];
    let result=await getquery(sql,parameters);
    res.status(200).json({res:result});
}

ctrl.getProveedores=async(req,res)=>{
    let sql='Select * from Proveedor where EliminarProveedor=0';
    let result= await getquery(sql);
    res.json({res:result})
}
ctrl.cantidadProveedores=async(req,res)=>{
    let sql='SELECT COUNT(NombreProveedor) as numero from Proveedor where EliminarProveedor=0';
    let result=await getquery(sql);
    res.json(result[0]);
}

ctrl.deleteProv= async(req,res)=>{
    let sql='Call EliminarProveedor(?)';
    let result=await getquery(sql,req.params.id);

    if(result.errno){
        res.json({res:{err:result.errno,descripcion:result.code}})
    }else{
        res.json({res:"Proveedor Eliminado"});
    }
}

module.exports=ctrl;