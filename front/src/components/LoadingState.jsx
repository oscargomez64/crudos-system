import { LoaderCircle } from 'lucide-react';

export default function LoadingState({ message = 'Cargando datos...' }) {
  return (
    <div className="loading-state">
      <LoaderCircle size={24} className="spin" />
      <span>{message}</span>
    </div>
  );
}
