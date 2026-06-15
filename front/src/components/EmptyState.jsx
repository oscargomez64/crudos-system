import { Inbox } from 'lucide-react';

export default function EmptyState({ message = 'No hay registros disponibles.' }) {
  return (
    <div className="empty-state">
      <Inbox size={24} />
      <span>{message}</span>
    </div>
  );
}
