const pool = require('../db/connect');

const consultas = {
  agrupadas: {
    ventasPorCliente: {
      nombre: 'Total de ventas por cliente',
      sql: `
        SELECT c.Nombre AS Cliente,
               SUM(p.TotalVenta) AS TotalComprado
        FROM Cliente c
        INNER JOIN Pedido p ON c.IdCliente = p.IdCliente
        GROUP BY c.Nombre
      `
    },
    litrosPorCerveza: {
      nombre: 'Litros vendidos por cerveza',
      sql: `
        SELECT ce.Nombre AS Cerveza,
               SUM(pc.CantidadLitros) AS LitrosVendidos
        FROM Cerveza ce
        INNER JOIN Pedido_Cerveza pc ON ce.IdCerveza = pc.IdCerveza
        GROUP BY ce.Nombre
      `
    },
    ingredientesPorProveedor: {
      nombre: 'Cantidad de ingredientes por proveedor',
      sql: `
        SELECT p.Nombre AS Proveedor,
               COUNT(i.IdIngrediente) AS TotalIngredientes
        FROM Proveedor p
        INNER JOIN Ingrediente i ON p.IdProveedor = i.IdProveedor
        GROUP BY p.Nombre
      `
    }
  },
  having: {
    clientesComprasMayores1000: {
      nombre: 'Clientes con compras mayores a 1000',
      sql: `
        SELECT c.Nombre AS Cliente,
               SUM(p.TotalVenta) AS TotalComprado
        FROM Cliente c
        INNER JOIN Pedido p ON c.IdCliente = p.IdCliente
        GROUP BY c.Nombre
        HAVING SUM(p.TotalVenta) > 1000
      `
    },
    cervezasMas10Litros: {
      nombre: 'Cervezas con mas de 10 litros vendidos',
      sql: `
        SELECT ce.Nombre AS Cerveza,
               SUM(pc.CantidadLitros) AS LitrosVendidos
        FROM Cerveza ce
        INNER JOIN Pedido_Cerveza pc ON ce.IdCerveza = pc.IdCerveza
        GROUP BY ce.Nombre
        HAVING SUM(pc.CantidadLitros) > 10
      `
    },
    proveedoresMasUnIngrediente: {
      nombre: 'Proveedores con mas de un ingrediente',
      sql: `
        SELECT p.Nombre AS Proveedor,
               COUNT(i.IdIngrediente) AS TotalIngredientes
        FROM Proveedor p
        INNER JOIN Ingrediente i ON p.IdProveedor = i.IdProveedor
        GROUP BY p.Nombre
        HAVING COUNT(i.IdIngrediente) > 1
      `
    }
  },
  multitabla: {
    pedidosClientes: {
      nombre: 'Pedidos con informacion del cliente',
      sql: `
        SELECT c.Nombre AS Cliente,
               p.Fecha,
               p.TotalVenta
        FROM Pedido p
        INNER JOIN Cliente c ON p.IdCliente = c.IdCliente
      `
    },
    detallePedidos: {
      nombre: 'Detalle completo de pedidos',
      sql: `
        SELECT cl.Nombre AS Cliente,
               ce.Nombre AS Cerveza,
               pc.CantidadLitros,
               pc.PrecioUnitarioAplicado
        FROM Pedido_Cerveza pc
        INNER JOIN Pedido p ON pc.IdPedido = p.IdPedido
        INNER JOIN Cliente cl ON p.IdCliente = cl.IdCliente
        INNER JOIN Cerveza ce ON pc.IdCerveza = ce.IdCerveza
      `
    },
    ingredientesProveedor: {
      nombre: 'Ingredientes con su proveedor',
      sql: `
        SELECT i.Nombre AS Ingrediente,
               i.StockActual,
               p.Nombre AS Proveedor,
               p.Ciudad
        FROM Ingrediente i
        INNER JOIN Proveedor p ON i.IdProveedor = p.IdProveedor
      `
    },
    cervezasClientesGuadalajara: {
      nombre: 'Cervezas pedidas por clientes de Guadalajara',
      sql: `
        SELECT DISTINCT ce.Nombre AS Cerveza
        FROM Cliente cl
        INNER JOIN Pedido p ON cl.IdCliente = p.IdCliente
        INNER JOIN Pedido_Cerveza pc ON p.IdPedido = pc.IdPedido
        INNER JOIN Cerveza ce ON pc.IdCerveza = ce.IdCerveza
        WHERE cl.Ciudad = 'Guadalajara'
      `
    }
  }
};

async function ejecutarConsulta(res, definicion) {
  try {
    const [data] = await pool.query(definicion.sql);

    res.status(200).json({
      ok: true,
      consulta: definicion.nombre,
      data
    });
  } catch (error) {
    console.error(`Error al ejecutar consulta "${definicion.nombre}":`, error);
    res.status(500).json({
      ok: false,
      message: 'Error al ejecutar la consulta',
      error: error.message || error.code || String(error) || 'Error desconocido'
    });
  }
}

const getVentasPorCliente = async (req, res) => ejecutarConsulta(res, consultas.agrupadas.ventasPorCliente);
const getLitrosPorCerveza = async (req, res) => ejecutarConsulta(res, consultas.agrupadas.litrosPorCerveza);
const getIngredientesPorProveedor = async (req, res) => ejecutarConsulta(res, consultas.agrupadas.ingredientesPorProveedor);

const getClientesComprasMayores1000 = async (req, res) => ejecutarConsulta(res, consultas.having.clientesComprasMayores1000);
const getCervezasMas10Litros = async (req, res) => ejecutarConsulta(res, consultas.having.cervezasMas10Litros);
const getProveedoresMasUnIngrediente = async (req, res) => ejecutarConsulta(res, consultas.having.proveedoresMasUnIngrediente);

const getPedidosClientes = async (req, res) => ejecutarConsulta(res, consultas.multitabla.pedidosClientes);
const getDetallePedidos = async (req, res) => ejecutarConsulta(res, consultas.multitabla.detallePedidos);
const getIngredientesProveedor = async (req, res) => ejecutarConsulta(res, consultas.multitabla.ingredientesProveedor);
const getCervezasClientesGuadalajara = async (req, res) => ejecutarConsulta(res, consultas.multitabla.cervezasClientesGuadalajara);

module.exports = {
  getVentasPorCliente,
  getLitrosPorCerveza,
  getIngredientesPorProveedor,
  getClientesComprasMayores1000,
  getCervezasMas10Litros,
  getProveedoresMasUnIngrediente,
  getPedidosClientes,
  getDetallePedidos,
  getIngredientesProveedor,
  getCervezasClientesGuadalajara
};
