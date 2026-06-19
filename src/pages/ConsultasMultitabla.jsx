import {
  getCervezasClientesGuadalajara,
  getDetallePedidos,
  getIngredientesProveedor,
  getPedidosClientes
} from '../api/consultasApi.js';
import ConsultasPage from './ConsultasPage.jsx';

const consultas = [
  {
    id: 'pedidos-clientes',
    title: 'Pedidos con informacion del cliente',
    description: 'Une pedidos con clientes para mostrar cliente, fecha y total de venta.',
    execute: getPedidosClientes
  },
  {
    id: 'detalle-pedidos',
    title: 'Detalle completo de pedidos',
    description: 'Combina cliente, pedido, cerveza y detalle vendido por litro.',
    execute: getDetallePedidos
  },
  {
    id: 'ingredientes-proveedor',
    title: 'Ingredientes con su proveedor',
    description: 'Muestra ingrediente, stock, proveedor y ciudad del proveedor.',
    execute: getIngredientesProveedor
  },
  {
    id: 'cervezas-clientes-guadalajara',
    title: 'Cervezas pedidas por clientes de Guadalajara',
    description: 'Lista cervezas distintas pedidas por clientes ubicados en Guadalajara.',
    execute: getCervezasClientesGuadalajara
  }
];

export default function ConsultasMultitabla() {
  return (
    <ConsultasPage
      eyebrow="INNER JOIN"
      title="Consultas multitabla"
      description="Consultas que combinan informacion de varias tablas relacionadas."
      consultas={consultas}
    />
  );
}
