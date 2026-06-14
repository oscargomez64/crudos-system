const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clienteRoutes = require('./routes/cliente.routes');
const cervezaRoutes = require('./routes/cerveza.routes');
const proveedorRoutes = require('./routes/proveedor.routes');
const ingredienteRoutes = require('./routes/ingrediente.routes');
const pedidoRoutes = require('./routes/pedido.routes');
const pedidoCervezaRoutes = require('./routes/pedido-cerveza.routes');
const cervezaIngredienteRoutes = require('./routes/cerveza-ingrediente.routes');
const pool = require('./db/connect');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      message: 'API crudOS funcionando correctamente'
    }
  });
});

app.use('/api/cliente', clienteRoutes);
app.use('/api/cerveza', cervezaRoutes);
app.use('/api/proveedor', proveedorRoutes);
app.use('/api/ingrediente', ingredienteRoutes);
app.use('/api/pedido', pedidoRoutes);
app.use('/api/pedido_cerveza', pedidoCervezaRoutes);
app.use('/api/cerveza_ingrediente', cervezaIngredienteRoutes);

async function testConnection() {
  try {
    await pool.query('SELECT 1 + 1 AS test');
    console.log('Conexion a la base de datos establecida');
  } catch (error) {
    console.error('Error al conectar la base de datos:', error.message);
  }
}

app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  await testConnection();
});
