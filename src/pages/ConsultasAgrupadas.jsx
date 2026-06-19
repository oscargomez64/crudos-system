import {
  getIngredientesPorProveedor,
  getLitrosPorCerveza,
  getVentasPorCliente
} from '../api/consultasApi.js';
import ConsultasPage from './ConsultasPage.jsx';

const consultas = [
  {
    id: 'ventas-por-cliente',
    title: 'Total de ventas por cliente',
    description: 'Suma el total comprado por cada cliente usando GROUP BY.',
    execute: getVentasPorCliente
  },
  {
    id: 'litros-por-cerveza',
    title: 'Litros vendidos por cerveza',
    description: 'Agrupa los litros vendidos por nombre de cerveza.',
    execute: getLitrosPorCerveza
  },
  {
    id: 'ingredientes-por-proveedor',
    title: 'Cantidad de ingredientes por proveedor',
    description: 'Cuenta cuantos ingredientes tiene asociado cada proveedor.',
    execute: getIngredientesPorProveedor
  }
];

export default function ConsultasAgrupadas() {
  return (
    <ConsultasPage
      eyebrow="GROUP BY"
      title="Consultas con campos agrupados"
      description="Consultas que agrupan registros y calculan totales o conteos por categoria."
      consultas={consultas}
    />
  );
}
