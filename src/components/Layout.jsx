import { Database } from 'lucide-react';
import Sidebar from './Sidebar.jsx';

export default function Layout({ activeKey, onNavigate, entities, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">
          <Database size={22} />
        </div>
        <div>
          <h1>La Espuma Dorada</h1>
          <p>Panel de administracion</p>
        </div>
      </header>

      <div className="workspace">
        <Sidebar activeKey={activeKey} onNavigate={onNavigate} entities={entities} />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}
