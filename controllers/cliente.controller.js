const conn= require('./connection.controller');
let ctrl={};

ctrl.cantidadClientes= async(req,res)=>{
    let sql='SELECT COUNT(NombreCliente) as numero from Clientes';
    let result=await conn.getquery(sql);
    res.json(result[0]);
}

ctrl.saveTipo=async(req,res)=>{   
    let sql= `CALL RegistrarTiposDeClientes(?,?)`;
    let parameters=[req.body.tipo,0];
    const result= await conn.getquery(sql,parameters);
    res.status(200).json(result);
}

ctrl.getTipos=async(req,res)=>{
    let sql=`Select * from TipoCliente`;
    let result=await conn.getquery(sql);
    res.json({res:result});
}

ctrl.getClientes=async(req,res)=>{
    let sql='SELECT * from Clientes where EliminarCliente=0';
    let result=await conn.getquery(sql);
    res.json({res:result});
}

ctrl.deleteTipo=async(req,res)=>{   
    let sql= `CALL EliminarTipoDeCliente(?)`;
    const result= await conn.getquery(sql,req.params.id);
    res.status(200).json(result);
}

ctrl.save=async(req,res)=>{
    const sql=`CALL RegistrarCliente(?,?,?,?,?,?,?,?)`;
    const parameters=[req.body.tipo,req.body.nombre,req.body.apellido, req.body.correo, req.body.pass,req.body.tel, req.body.nit, 0];
    const result= await conn.getquery(sql,parameters);
    res.status(200).json(result);
}

ctrl.delete=async(req,res)=>{   
    const sql= `CALL EliminarClientes(?)`;
    const result= await conn.getquery(sql,req.params.id);
    res.status(200).json(result);
}

ctrl.login=async(req,res)=>{
    const sql=`Select Id_Cliente,NombreCliente, ApellidoCliente From Clientes WHERE CorreoCliente=\'${req.body.correo}\' && PasswordCliente=\'${req.body.pass}\'`
    let result=await conn.getquery(sql);
    
    if(result.length>0){    
        res.status(200).json(result[0]);
    }else{
        res.json({res:'Vuelva intentarlo'})
    }
}

module.exports=ctrl;