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
    let sql='CALL EliminarCategoriaProducto(?)';
    let result=await getquery(sql,req.params.id);
    res.status(200).json({res:result});
}

ctrl.save=async(req,res)=>{
   let save=`insert into 'Producto'(?,?,?),${req.body}`;
  let result=await getquery(save);
   res.status(200).json({res:result});
}

ctrl.search=async(req,res)=>{
    //Cambiar por producto:nameproduct

    console.log(req.params.term);
    let save=`SELECT * FROM Empleados WHERE NombreEmpleado LIKE \'${req.params.term}%\'`;
    const result= await getquery(save);
    console.log(result);
    res.status(200).json(result);
}


ctrl.saveProv=async(req,res)=>{
    let sql='CALL (?)';
    let result=await getquery(sql,req.params.id);
    res.status(200).json({res:result});
}

module.exports=ctrl;