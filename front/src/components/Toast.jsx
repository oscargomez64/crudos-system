import { AlertCircle, CheckCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) {
    return null;
  }

  const Icon = toast.type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`toast ${toast.type || 'info'}`} role="status">
      <Icon size={18} />
      <span>{toast.message}</span>
      <button type="button" className="icon-button compact" onClick={onClose} title="Cerrar">
        <X size={15} />
      </button>
    </div>
  );
}
