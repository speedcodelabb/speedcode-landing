import ServicePageTemplate from '../../components/ServicePageTemplate';

export default function Consultancy() {
  return (
    <ServicePageTemplate
      title="Consultoría Tecnológica"
      tagline="Estrategia Técnica para Proyectos en Fase Cero"
      description="Te acompañamos desde la concepción de la idea para elegir el stack tecnológico perfecto y evitar costosos errores de arquitectura."
      scope={[
        'Evaluación de viabilidad técnica para startups',
        'Elección de Stack Tecnológico (MERN, Python, Go, etc.)',
        'Auditoría de seguridad y performance',
        'Planificación de escalabilidad a largo plazo',
        'Mentoria para equipos internos de desarrollo'
      ]}
      process={[
        { title: 'Entrevista de Alcance', desc: 'Entendemos profundamente tus objetivos de negocio.' },
        { title: 'Propuesta Arquitectónica', desc: 'Entregamos un plano técnico detallado de la solución.' },
        { title: 'Acompañamiento Estratégico', desc: 'Te guiamos durante las fases críticas de la implementación.' }
      ]}
      examples={[
        { title: 'Roadmap para Fintech Disruptiva', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600' },
        { title: 'Auditoría de Seguridad Bancaria', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600' }
      ]}
    />
  );
}
