import { Boxes, Home } from 'lucide-react';

export default function Sidebar({ activeKey, onNavigate, entities }) {
  return (
    <aside className="sidebar" aria-label="Navegacion principal">
      <button
        type="button"
        className={`nav-item ${activeKey === 'dashboard' ? 'active' : ''}`}
        onClick={() => onNavigate('dashboard')}
        title="Dashboard"
      >
        <Home size={18} />
        <span>Dashboard</span>
      </button>

      <div className="nav-divider" />

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
