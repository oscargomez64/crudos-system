import { Boxes, Home, ListChecks, Network, Sigma, TableProperties } from 'lucide-react';

const consultaItems = [
  { key: 'consultas-sencillas', label: 'Consultas sencillas', Icon: ListChecks },
  { key: 'consultas-agrupadas', label: 'Consultas con campos agrupados', Icon: TableProperties },
  { key: 'consultas-having', label: 'Consultas con HAVING', Icon: Sigma },
  { key: 'consultas-multitabla', label: 'Consultas multitabla', Icon: Network }
];

export default function Navbar({ activeKey, onNavigate, entities }) {
  return (
    <aside className="sidebar" aria-label="Navegacion principal">
      <button
        type="button"
        className={`nav-item ${activeKey === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
        title="Inicio"
      >
        <Home size={18} />
        <span>Inicio</span>
      </button>

      <div className="nav-divider" />
      <span className="nav-label">Consultas</span>

      {consultaItems.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          className={`nav-item ${activeKey === key ? 'active' : ''}`}
          onClick={() => onNavigate(key)}
          title={label}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}

      <div className="nav-divider" />
      <span className="nav-label">CRUD</span>

      {entities.map((entity) => (
        <button
          key={entity.key}
          type="button"
          className={`nav-item ${activeKey === entity.key ? 'active' : ''}`}
          onClick={() => onNavigate(entity.key)}
          title={entity.label}
        >
          <Boxes size={18} />
          <span>{entity.label}</span>
        </button>
      ))}
    </aside>
  );
}
