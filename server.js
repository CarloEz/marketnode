const express = require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/empleados',require('./routes/empleado.routes.js'));
app.use('/api/productos',require('./routes/producto.routes.js'));
app.use('/api/clientes',require('./routes/cliente.routes.js'));
app.use('/api/ventas',require('./routes/ventas.routes.js'));

app.listen(port,()=>{
    console.log("servidor coriendo :V");
});