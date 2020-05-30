const conn = require('./connection.controller');
let ctrl = {};

ctrl.cantidadEmp = async (req, res) => {
    let sql = 'SELECT COUNT(NombreEmpleado) as numero from Empleados';
    let result = await conn.getquery(sql);
    res.json(result[0]);
}

ctrl.saveEmp = async (req, res) => {
    const sql = 'CALL RegistrarEmpleado(?,?,?,?,?,?,?,?,?)';
    const parameters = [req.body.nombre, req.body.apellido, req.body.correo, req.body.pass,
    req.body.tel, req.body.nit, req.body.residencia, req.body.tipoEmpleado, 0];

    const result = await conn.getquery(sql, parameters);
    res.status(200).json(result);
}

ctrl.getEmpresa = async (req, res) => {
    let sql = 'Select * from DatosEmpresa where Id_DatoEmpresa=1';
    let result = await conn.getquery(sql);
    res.json(result);
}

ctrl.delete = async (req, res) => {
    const sql = 'CALL EliminarEmpleados(?)';
    const result = await conn.getquery(sql, req.params.id);
    res.status(200).json(result);
}

ctrl.login = async (req, res) => {
    const sql = `Select Id_Empleado,NombreEmpleado,ApellidoEmpleado From Empleados WHERE CorreoEmpleado=\'${req.body.correo}\' && PasswordEmpleados=\'${req.body.pass}\'`
    let result = await conn.getquery(sql);
    console.log(result);
    if (result.errno) {
        res.status(200).json({ res: 'Vuelva intentarlo' });
    } else {
        console.log("Entro");
        res.status(200).json(result[0]);
    }
}

ctrl.getEmpleados = async (req, res) => {
    let sql = 'SELECT * from Empleados where EliminarEmpleados=0';
    let result = await conn.getquery(sql);
    res.json({ res: result });
}

ctrl.empresa = async (req, res) => {
    const sql = 'CALL RegistrarDatosEmpresa(?,?,?,?,?,?,?)';
    const parameters = [req.body.nombre, req.body.slogan, req.body.logo, req.body.address, req.body.email, req.body.tel, 0];

    const result = await conn.getquery(sql, parameters);
    if (result.errno) {
        res.json({ res: { error: result.errno, desc: result.code } });
    } else {
        res.json({ res: 'Registrado exitosamente' });
    }
}

module.exports = ctrl;