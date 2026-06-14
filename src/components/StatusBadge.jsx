import { AlertCircle, CheckCircle, LoaderCircle } from 'lucide-react';

export default function StatusBadge({ status, message }) {
  const Icon = status === 'ok' ? CheckCircle : status === 'loading' ? LoaderCircle : AlertCircle;

  return (
    <div className={`status-badge ${status}`}>
      <Icon size={18} className={status === 'loading' ? 'spin' : ''} />
      <span>{message}</span>
    </div>
  );
}
