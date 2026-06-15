import ConsultaCard from '../components/ConsultaCard.jsx';

export default function ConsultasPage({ eyebrow, title, description, consultas }) {
  return (
    <div className="page-stack">
      <section className="module-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </section>

      <section className="consultas-list" aria-label={title}>
        {consultas.map((consulta) => (
          <ConsultaCard
            key={consulta.id}
            title={consulta.title}
            description={consulta.description}
            onExecute={consulta.execute}
          />
        ))}
      </section>
    </div>
  );
}
