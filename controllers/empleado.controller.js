const mariadb = require('../db');
let ctrl = {};

let getquery = async (query, parameters = null) => {
    try {
        let conn = await mariadb.getConn();
        const result = await conn.query(query, parameters);
        conn.end();
        return result;
    }
    catch (err) {
        console.log(err);
    }
}


ctrl.saveEmp = async (req, res) => {
    const sql = 'CALL RegistrarEmpleado(?,?,?,?,?,?,?,?,?)';
    const parameters = [req.body.nombre, req.body.apellido, req.body.correo,req.body.pass,
    req.body.tel, req.body.nit, req.body.residencia, req.body.tipoEmpleado, 0];

    const result =await getquery(sql, parameters);
    res.status(200).json(result);
}

ctrl.delete = async (req, res) => {
    const sql = 'CALL EliminarEmpleados(?)';
    const result =await getquery(sql, req.params.id);
    res.status(200).json(result);
}

module.exports = ctrl;