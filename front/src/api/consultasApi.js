import { apiClient } from './client.js';

function rowsFromResult(result) {
  return Array.isArray(result.data) ? result.data : [];
}

async function getRows(path) {
  const result = await apiClient.get(path);
  return rowsFromResult(result);
}

// Consultas sencillas existentes.
export async function getConsultasSencillas() {
  const [clientes, cervezas, proveedores, ingredientes] = await Promise.all([
    getClientesSencillos(),
    getCervezasSencillas(),
    getProveedoresSencillos(),
    getIngredientesSencillos()
  ]);

  return {
    clientes,
    cervezas,
    proveedores,
    ingredientes
  };
}

export function getClientesSencillos() {
  return getRows('/api/cliente');
}

export function getCervezasSencillas() {
  return getRows('/api/cerveza');
}

export function getProveedoresSencillos() {
  return getRows('/api/proveedor');
}

export function getIngredientesSencillos() {
  return getRows('/api/ingrediente');
}

// Consultas con campos agrupados.
export function getVentasPorCliente() {
  return getRows('/api/consultas/agrupadas/ventas-por-cliente');
}

export function getLitrosPorCerveza() {
  return getRows('/api/consultas/agrupadas/litros-por-cerveza');
}

export function getIngredientesPorProveedor() {
  return getRows('/api/consultas/agrupadas/ingredientes-por-proveedor');
}

// Consultas con HAVING.
export function getClientesComprasMayores1000() {
  return getRows('/api/consultas/having/clientes-compras-mayores-1000');
}

export function getCervezasMas10Litros() {
  return getRows('/api/consultas/having/cervezas-mas-10-litros');
}

export function getProveedoresMasUnIngrediente() {
  return getRows('/api/consultas/having/proveedores-mas-un-ingrediente');
}

// Consultas multitabla.
export function getPedidosClientes() {
  return getRows('/api/consultas/multitabla/pedidos-clientes');
}

export function getDetallePedidos() {
  return getRows('/api/consultas/multitabla/detalle-pedidos');
}

export function getIngredientesProveedor() {
  return getRows('/api/consultas/multitabla/ingredientes-proveedor');
}

export function getCervezasClientesGuadalajara() {
  return getRows('/api/consultas/multitabla/cervezas-clientes-guadalajara');
}
