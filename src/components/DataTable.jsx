import { Pencil, Search, Trash2 } from 'lucide-react';
import EmptyState from './EmptyState.jsx';
import LoadingState from './LoadingState.jsx';

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
}

export default function DataTable({
  entity,
  rows,
  loading,
  error,
  search,
  onSearchChange,
  onEdit,
  onDelete
}) {
  const visibleFields = entity.fields;

  if (loading) {
    return <LoadingState message="Cargando datos..." />;
  }

  if (error) {
    return <div className="notice error">{error}</div>;
  }

  return (
    <section className="table-section" aria-label={`Tabla ${entity.label}`}>
      <div className="table-toolbar">
        <label className="search-box">
          <Search size={17} />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar en tabla"
          />
        </label>
        <span className="row-count">{rows.length} registros</span>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="No hay registros disponibles." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {visibleFields.map((field) => (
                  <th key={field.name}>{field.label}</th>
                ))}
                <th className="actions-column">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={entity.compositeKeys ? entity.compositeKeys.map((key) => row[key]).join('-') : row[entity.idField] ?? index}>
                  {visibleFields.map((field) => (
                    <td key={field.name}>{formatValue(row[field.name])}</td>
                  ))}
                  <td className="table-actions">
                    <button type="button" className="icon-button" onClick={() => onEdit(row)} title="Editar">
                      <Pencil size={17} />
                    </button>
                    <button type="button" className="icon-button danger" onClick={() => onDelete(row)} title="Eliminar">
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
