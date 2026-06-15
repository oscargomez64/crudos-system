import EmptyState from './EmptyState.jsx';
import LoadingState from './LoadingState.jsx';

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
}

function getColumns(rows) {
  return rows.reduce((columns, row) => {
    Object.keys(row).forEach((column) => {
      if (!columns.includes(column)) {
        columns.push(column);
      }
    });

    return columns;
  }, []);
}

export default function TablaResultados({ rows, loading, error, executed }) {
  if (loading) {
    return <LoadingState message="Ejecutando consulta..." />;
  }

  if (error) {
    return <div className="notice error">{error}</div>;
  }

  if (!executed) {
    return (
      <div className="query-idle">
        <span>Resultado pendiente</span>
      </div>
    );
  }

  if (rows.length === 0) {
    return <EmptyState message="La consulta no regreso datos." />;
  }

  const columns = getColumns(rows);

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column}>{formatValue(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
