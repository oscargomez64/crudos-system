import { Plus, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createResourceApi } from '../api/resources.js';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import DataTable from '../components/DataTable.jsx';
import EntityForm from '../components/EntityForm.jsx';
import Toast from '../components/Toast.jsx';

function initialValues(entity) {
  return entity.fields.reduce((values, field) => {
    values[field.name] = '';
    return values;
  }, {});
}

function normalizeRecordForForm(entity, record) {
  return entity.fields.reduce((values, field) => {
    values[field.name] = record[field.name] ?? '';
    return values;
  }, {});
}

function validate(entity, values, mode) {
  const errors = {};

  entity.fields.forEach((field) => {
    const value = values[field.name];
    const empty = value === undefined || value === null || value === '';

    if (field.required && empty) {
      errors[field.name] = 'Campo requerido.';
      return;
    }

    if (!empty && (field.type === 'number' || field.type === 'decimal') && !Number.isFinite(Number(value))) {
      errors[field.name] = 'Ingresa un numero valido.';
    }

    if (!empty && field.type === 'date' && Number.isNaN(Date.parse(value))) {
      errors[field.name] = 'Ingresa una fecha valida.';
    }

    if (mode === 'edit' && field.readOnlyOnEdit) {
      return;
    }
  });

  return errors;
}

function filterRows(rows, search) {
  const value = search.trim().toLowerCase();

  if (!value) {
    return rows;
  }

  return rows.filter((row) => (
    Object.values(row).some((item) => String(item ?? '').toLowerCase().includes(value))
  ));
}

export default function EntityCrudPage({ entity }) {
  const resourceApi = useMemo(() => createResourceApi(entity), [entity]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState('create');
  const [formValues, setFormValues] = useState(initialValues(entity));
  const [formErrors, setFormErrors] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const filteredRows = useMemo(() => filterRows(rows, search), [rows, search]);

  async function loadRows() {
    setLoading(true);
    setError('');
    try {
      const data = await resourceApi.list();
      setRows(data);
    } catch (loadError) {
      console.error(`Error al cargar ${entity.label}:`, loadError);
      setError(loadError.message || 'No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setRows([]);
    setError('');
    setSearch('');
    setShowForm(false);
    setMode('create');
    setFormValues(initialValues(entity));
    setFormErrors({});
    setSelectedRecord(null);
    setRecordToDelete(null);
    loadRows();
  }, [entity.key]);

  function openCreateForm() {
    setMode('create');
    setSelectedRecord(null);
    setFormValues(initialValues(entity));
    setFormErrors({});
    setShowForm(true);
  }

  function openEditForm(record) {
    setMode('edit');
    setSelectedRecord(record);
    setFormValues(normalizeRecordForForm(entity, record));
    setFormErrors({});
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setMode('create');
    setSelectedRecord(null);
    setFormValues(initialValues(entity));
    setFormErrors({});
  }

  function handleChange(field, value) {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = validate(entity, formValues, mode);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'edit') {
        await resourceApi.update(selectedRecord, formValues);
        setToast({ type: 'success', message: 'Registro actualizado correctamente.' });
      } else {
        await resourceApi.create(formValues);
        setToast({ type: 'success', message: 'Registro creado correctamente.' });
      }

      closeForm();
      await loadRows();
    } catch (submitError) {
      console.error('Error al guardar registro:', submitError);
      setToast({ type: 'error', message: submitError.message || 'No se pudo guardar el registro.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!recordToDelete) {
      return;
    }

    setSubmitting(true);
    try {
      await resourceApi.remove(recordToDelete);
      setToast({ type: 'success', message: 'Registro eliminado correctamente.' });
      setRecordToDelete(null);
      await loadRows();
    } catch (deleteError) {
      console.error('Error al eliminar registro:', deleteError);
      setToast({ type: 'error', message: deleteError.message || 'No se pudo eliminar el registro.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="module-header">
        <div>
          <p className="eyebrow">Modulo CRUD</p>
          <h2>{entity.label}</h2>
          <p>{entity.description}</p>
        </div>
        <div className="module-actions">
          <button type="button" className="secondary-button" onClick={loadRows}>
            <RefreshCw size={17} />
            Recargar
          </button>
          <button type="button" className="primary-button" onClick={openCreateForm}>
            <Plus size={17} />
            Nuevo
          </button>
        </div>
      </section>

      {showForm ? (
        <EntityForm
          entity={entity}
          values={formValues}
          mode={mode}
          errors={formErrors}
          submitting={submitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      ) : null}

      <DataTable
        entity={entity}
        rows={filteredRows}
        loading={loading}
        error={error}
        search={search}
        onSearchChange={setSearch}
        onEdit={openEditForm}
        onDelete={setRecordToDelete}
      />

      <ConfirmDialog
        open={Boolean(recordToDelete)}
        title="Eliminar registro"
        message="Seguro que deseas eliminar este registro? Esta accion no se puede deshacer."
        loading={submitting}
        onCancel={() => setRecordToDelete(null)}
        onConfirm={confirmDelete}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
