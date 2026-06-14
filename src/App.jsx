import { useMemo, useState } from 'react';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EntityCrudPage from './pages/EntityCrudPage.jsx';
import { entities } from './config/entities.js';

export default function App() {
  const [activeKey, setActiveKey] = useState('dashboard');
  const activeEntity = useMemo(
    () => entities.find((entity) => entity.key === activeKey),
    [activeKey]
  );

  return (
    <Layout activeKey={activeKey} onNavigate={setActiveKey} entities={entities}>
      {activeKey === 'dashboard' ? (
        <Dashboard entities={entities} onNavigate={setActiveKey} />
      ) : (
        <EntityCrudPage entity={activeEntity} />
      )}
    </Layout>
  );
}
