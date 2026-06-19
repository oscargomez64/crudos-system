import { ListChecks, Network, RefreshCw, Sigma, TableProperties } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client.js';
import { getHealth } from '../api/resources.js';
import StatusBadge from '../components/StatusBadge.jsx';

const consultaSections = [
  {
    key: 'consultas-sencillas',
    label: 'Consultas sencillas',
    description: 'Lecturas basicas de las tablas principales.',
    Icon: ListChecks
  },
  {
    key: 'consultas-agrupadas',
    label: 'Consultas con campos agrupados',
    description: 'Totales y conteos calculados con GROUP BY.',
    Icon: TableProperties
  },
  {
    key: 'consultas-having',
    label: 'Consultas con HAVING',
    description: 'Agregados filtrados despues de agrupar.',
    Icon: Sigma
  },
  {
    key: 'consultas-multitabla',
    label: 'Consultas multitabla',
    description: 'Resultados construidos con INNER JOIN.',
    Icon: Network
  }
];

export default function Home({ entities, onNavigate }) {
  const [health, setHealth] = useState({ status: 'loading', message: 'Verificando backend...' });

  async function loadHealth() {
    setHealth({ status: 'loading', message: 'Verificando backend...' });

    try {
      await getHealth();
      setHealth({ status: 'ok', message: 'Backend conectado correctamente' });
    } catch (error) {
      console.error('Error al consultar /health:', error);
      setHealth({
        status: 'error',
        message: 'No se pudo conectar con el backend en el puerto 3000.'
      });
    }
  }

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">LaEspumaDorada</p>
          <h2>Consultas SQL</h2>
          <p>Interfaz organizada para ejecutar consultas sencillas, agrupadas, con HAVING y multitabla.</p>
        </div>
        <div className="health-box">
          <StatusBadge status={health.status} message={health.message} />
          <span className="api-url">API: {apiClient.baseUrl}</span>
          <button type="button" className="secondary-button" onClick={loadHealth}>
            <RefreshCw size={17} />
            Revisar
          </button>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h3>Secciones principales</h3>
          <p>Elige una categoria de consulta.</p>
        </div>
        <div className="quick-grid query-grid">
          {consultaSections.map(({ key, label, description, Icon }) => (
            <button
              key={key}
              type="button"
              className="quick-card query-card"
              onClick={() => onNavigate(key)}
            >
              <Icon size={22} />
              <span>{label}</span>
              <small>{description}</small>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h3>Administracion CRUD</h3>
          <p>Modulos de mantenimiento de datos.</p>
        </div>
        <div className="quick-grid">
          {entities.map((entity) => (
            <button
              key={entity.key}
              type="button"
              className="quick-card"
              onClick={() => onNavigate(entity.key)}
            >
              <span>{entity.label}</span>
              <small>{entity.description}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
