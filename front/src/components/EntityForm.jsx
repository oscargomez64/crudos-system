import { Save, X } from 'lucide-react';

function inputType(type) {
  if (type === 'decimal' || type === 'number') {
    return 'number';
  }

  return type || 'text';
}

function inputStep(type) {
  if (type === 'decimal') {
    return '0.01';
  }

  if (type === 'number') {
    return '1';
  }

  return undefined;
}

export default function EntityForm({
  entity,
  values,
  mode,
  errors,
  submitting,
  onChange,
  onSubmit,
  onCancel
}) {
  const isEditing = mode === 'edit';

  return (
    <form className="entity-form" onSubmit={onSubmit}>
      <div className="form-header">
        <div>
          <h3>{isEditing ? `Editar ${entity.singular}` : `Nuevo ${entity.singular}`}</h3>
          <p>Completa los campos requeridos para guardar el registro.</p>
        </div>
      </div>

      <div className="form-grid">
        {entity.fields.map((field) => {
          const readOnly = isEditing && field.readOnlyOnEdit;
          const error = errors[field.name];

          return (
            <label className="field" key={field.name}>
              <span>
                {field.label}
                {field.required ? <b>*</b> : null}
              </span>

              {field.type === 'select' ? (
                <select
                  value={values[field.name] ?? ''}
                  disabled={readOnly || submitting}
                  onChange={(event) => onChange(field.name, event.target.value)}
                >
                  <option value="">Selecciona una opcion</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={inputType(field.type)}
                  step={inputStep(field.type)}
                  value={values[field.name] ?? ''}
                  readOnly={readOnly}
                  disabled={submitting}
                  onChange={(event) => onChange(field.name, event.target.value)}
                />
              )}

              {error ? <small>{error}</small> : null}
            </label>
          );
        })}
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel} disabled={submitting}>
          <X size={17} />
          Cancelar
        </button>
        <button type="submit" className="primary-button" disabled={submitting}>
          <Save size={17} />
          {submitting ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
