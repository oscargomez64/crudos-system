import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onCancel, onConfirm, loading }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="dialog-icon">
          <AlertTriangle size={22} />
        </div>
        <h3 id="confirm-title">{title}</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button type="button" className="secondary-button" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button type="button" className="danger-button" onClick={onConfirm} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
