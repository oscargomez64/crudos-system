const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clienteRoutes = require('./routes/cliente.routes');
const pool = require('./db/connect');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.send('API crudOS funcionando correctamente');
});

app.use('/api/cliente', clienteRoutes);

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 as test');
    console.log('Conexión a la base de datos establecida');
  } catch (error) {
    console.error('Error al conectar la base de datos: ', error.message);
  }
}

app.listen(PORT, async() => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  await testConnection();
});
