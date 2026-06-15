import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client.js';
import { getHealth } from '../api/resources.js';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Dashboard({ entities, onNavigate }) {
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
        message: 'No se pudo conectar con el backend. Verifica que npm start este corriendo en el puerto 3000.'
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
          <p className="eyebrow">Base configurada</p>
          <h2>LaEspumaDorada</h2>
          <p>
            Administra clientes, catalogos, pedidos y relaciones desde una interfaz CRUD conectada al backend Express.
          </p>
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
          <h3>Accesos rapidos</h3>
          <p>Selecciona un modulo para consultar, crear, editar o eliminar registros.</p>
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
