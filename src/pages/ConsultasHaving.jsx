import {
  getCervezasMas10Litros,
  getClientesComprasMayores1000,
  getProveedoresMasUnIngrediente
} from '../api/consultasApi.js';
import ConsultasPage from './ConsultasPage.jsx';

const consultas = [
  {
    id: 'clientes-compras-mayores-1000',
    title: 'Clientes con compras mayores a 1000',
    description: 'Filtra clientes cuyo total comprado supera 1000 despues de agrupar.',
    execute: getClientesComprasMayores1000
  },
  {
    id: 'cervezas-mas-10-litros',
    title: 'Cervezas con mas de 10 litros vendidos',
    description: 'Muestra cervezas cuya suma de litros vendidos es mayor a 10.',
    execute: getCervezasMas10Litros
  },
  {
    id: 'proveedores-mas-un-ingrediente',
    title: 'Proveedores con mas de un ingrediente',
    description: 'Filtra proveedores que tienen mas de un ingrediente registrado.',
    execute: getProveedoresMasUnIngrediente
  }
];

export default function ConsultasHaving() {
  return (
    <ConsultasPage
      eyebrow="HAVING"
      title="Consultas con HAVING"
      description="Consultas que aplican filtros despues de calcular agregados."
      consultas={consultas}
    />
  );
}
