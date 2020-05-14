const mariadb = require('mariadb');

let pool = mariadb.createPool({ // Open a new connection                                                                                                                                           
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

let getConn=async()=>{
    let conn= await pool.getConnection();
    return conn;
}

module.exports.getConn= getConn;