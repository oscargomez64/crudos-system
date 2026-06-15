import { Play, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import TablaResultados from './TablaResultados.jsx';

export default function ConsultaCard({ title, description, onExecute }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [executed, setExecuted] = useState(false);

  async function execute() {
    setLoading(true);
    setError('');

    try {
      const data = await onExecute();
      setRows(Array.isArray(data) ? data : []);
      setExecuted(true);
    } catch (executeError) {
      console.error(`Error al ejecutar "${title}":`, executeError);
      setRows([]);
      setExecuted(true);
      setError(executeError.message || 'No se pudo ejecutar la consulta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="consulta-card">
      <div className="consulta-card-header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={execute}
          disabled={loading}
          title={executed ? 'Volver a ejecutar' : 'Ejecutar consulta'}
        >
          {executed ? <RotateCcw size={17} /> : <Play size={17} />}
          {executed ? 'Reejecutar' : 'Ejecutar'}
        </button>
      </div>

      <TablaResultados rows={rows} loading={loading} error={error} executed={executed} />
    </article>
  );
}
