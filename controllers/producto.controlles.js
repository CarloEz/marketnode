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
    //Falta llamar al procedimiento.
    let sql='Select * from CategoriaProducto';
    let result=await getquery(sql);
    res.status(200).json({res:result});
}


//PRODUCTOS
ctrl.contProducts= async(req,res)=>{
    let sql='Select count(NombreProducto) as \'cantidad\' from Producto';
    let result=await getquery(sql); 
    if(!result.errno){
        res.json({res:result});
    }
}

ctrl.getProducts=async(req,res)=>{
    let sql='Select * from Producto';
    let result= await getquery(sql);
    res.status(200).json({res:result});   
  }

ctrl.addProd=async(req,res)=>{
    req.body.cantidad
    let sql=`update Producto set ExistenciaBodega=(ExistenciaBodega+${req.body.cantidad}) where NombreProducto=\'${req.body.product}\'`;
    let result= await getquery(sql);
    res.json(result);
}

ctrl.deleteProd= async(req,res)=>{
    let sql=`update Producto set ExistenciaBodega=(ExistenciaBodega-${req.body.cantidad}) where NombreProducto=\'${req.body.product}\'`;
    let result= await getquery(sql);
    res.json(result);
}

ctrl.save=async(req,res)=>{
    let Imgname=null;
    if(req.file){
        const ext= path.extname(req.file.originalname);
        Imgname=req.file.filename+ext;
        fs.renameSync(req.file.path, './public/products/' + Imgname);
    }

    let sql=`Insert into Producto(Id_Empleado,Id_CategoriaProducto,Imagen,NombreProducto,PrecioVentaUnidad,PrecioVentaMayoreo,MarcaProducto,PrecioCostoProducto,Descripcion,ExistenciaBodega,Vencidos,Presentacion,UnidadMedida,EliminarProducto) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    let parameters=[req.body.idemp,req.body.idcat,Imgname,req.body.producto,req.body.venta,req.body.ventamayoreo,req.body.marca,req.body.costo,req.body.descripcion,req.body.cantidad,req.body.vencidos,req.body.presentacion,req.body.unidadMedida,0];
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

ctrl.getProv= async(req,res)=>{
    let sql='Select * from Proveedor';
    let result= await getquery(sql);

    res.json({res:result});
}

module.exports=ctrl;