import {
  getCervezasSencillas,
  getClientesSencillos,
  getIngredientesSencillos,
  getProveedoresSencillos
} from '../api/consultasApi.js';
import ConsultasPage from './ConsultasPage.jsx';

const consultas = [
  {
    id: 'clientes',
    title: 'Clientes registrados',
    description: 'Consulta directa de clientes disponibles en la base de datos.',
    execute: getClientesSencillos
  },
  {
    id: 'cervezas',
    title: 'Cervezas registradas',
    description: 'Consulta directa del catalogo de cervezas.',
    execute: getCervezasSencillas
  },
  {
    id: 'proveedores',
    title: 'Proveedores registrados',
    description: 'Consulta directa de proveedores de ingredientes.',
    execute: getProveedoresSencillos
  },
  {
    id: 'ingredientes',
    title: 'Ingredientes registrados',
    description: 'Consulta directa del inventario de ingredientes.',
    execute: getIngredientesSencillos
  }
];

export default function ConsultasSencillas() {
  return (
    <ConsultasPage
      eyebrow="SELECT"
      title="Consultas sencillas"
      description="Consultas basicas que leen registros existentes sin agrupaciones ni uniones complejas."
      consultas={consultas}
    />
  );
}
