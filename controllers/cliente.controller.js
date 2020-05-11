//Tablas : Cliente , tipoCliente
const mariadb= require('../db');
let ctrl={};

let getquery=async(query,parameters=null)=>{
    try{
        let conn= await mariadb.getConn();
        const result= await conn.query(query,parameters);
        conn.end();
        return result;
    }
    catch(err){
        console.log(err);
    }
}

ctrl.saveTipo=async(req,res)=>{   
    let sql= `CALL RegistrarTiposDeClientes(?,?)`;
    let parameters=[req.body.tipo,0];
    const result= await getquery(sql,parameters);
    res.status(200).json(result);
}

ctrl.deleteTipo=async(req,res)=>{   
    let sql= `CALL EliminarTipoDeCliente(?)`;
    const result= await getquery(sql,req.params.id);
    res.status(200).json(result);
}


ctrl.save=async(req,res)=>{
    const sql=`CALL RegistrarCliente(?,?,?,?,?,?,?,?)`;
    const parameters=[req.body.tipo,req.body.nombre,req.body.apellido, req.body.correo, req.body.pass,req.body.tel, req.body.nit, 0];
    const result= await getquery(sql,parameters);
    res.status(200).json(result);
}

ctrl.delete=async(req,res)=>{   
    const sql= `CALL EliminarClientes(?)`;
    const result= await getquery(sql,req.params.id);
    res.status(200).json(result);
}

ctrl.login=async(req,res)=>{
    const sql=`Select Id_Cliente,NombreCliente From Clientes WHERE CorreoCliente=\'${req.body.correo}\' && PasswordCliente=\'${req.body.pass}\'`
    let result=await getquery(sql);
    console.log(result);
    
    if(result.length>0){    
        res.status(200).json(result[0]);
    }else{
        res.status(400).json({res:'Vuelva intentarlo'})
    }
}

ctrl.data= async(req,res)=>{
    //Data
    const sql=`Select * From DATA`;
    let result=await getquery(sql);
    res.status(200).json(result);
}

module.exports=ctrl;