const mysql = require('mysql2/promise');

function getEnv(name, fallback, options = {}) {
  const value = process.env[name];

  if (value === undefined || value === null || value === '') {
    if (options.required) {
      console.warn(`Variable de entorno ${name} no definida; usando valor por defecto de desarrollo.`);
    }
    return fallback;
  }

  return value;
}

const dbPort = Number(getEnv('DB_PORT', '3306'));

if (!Number.isInteger(dbPort) || dbPort <= 0) {
  throw new Error('DB_PORT debe ser un numero entero positivo.');
}

const pool = mysql.createPool({
  host: getEnv('DB_HOST', 'localhost', { required: true }),
  port: dbPort,
  user: getEnv('DB_USER', 'root', { required: true }),
  password: getEnv('DB_PASSWORD', ''),
  database: getEnv('DB_NAME', 'LaEspumaDorada', { required: true }),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
