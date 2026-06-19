import { useMemo, useState } from 'react';
import Layout from './components/Layout.jsx';
import ConsultasAgrupadas from './pages/ConsultasAgrupadas.jsx';
import ConsultasHaving from './pages/ConsultasHaving.jsx';
import ConsultasMultitabla from './pages/ConsultasMultitabla.jsx';
import ConsultasSencillas from './pages/ConsultasSencillas.jsx';
import EntityCrudPage from './pages/EntityCrudPage.jsx';
import Home from './pages/Home.jsx';
import { entities } from './config/entities.js';

export default function App() {
  const [activeKey, setActiveKey] = useState('home');
  const activeEntity = useMemo(
    () => entities.find((entity) => entity.key === activeKey),
    [activeKey]
  );

  const pageByKey = {
    home: <Home entities={entities} onNavigate={setActiveKey} />,
    'consultas-sencillas': <ConsultasSencillas />,
    'consultas-agrupadas': <ConsultasAgrupadas />,
    'consultas-having': <ConsultasHaving />,
    'consultas-multitabla': <ConsultasMultitabla />
  };

  return (
    <Layout activeKey={activeKey} onNavigate={setActiveKey} entities={entities}>
      {pageByKey[activeKey] || (activeEntity ? <EntityCrudPage entity={activeEntity} /> : pageByKey.home)}
    </Layout>
  );
}
