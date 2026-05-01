import ServicePageTemplate from '../../components/ServicePageTemplate';

export default function WebDev() {
  return (
    <ServicePageTemplate
      title="Desarrollo Web"
      tagline="Ecosistemas Digitales de Alto Rendimiento"
      description="Creamos experiencias web que combinan diseño vanguardista con una arquitectura técnica infalible y ultra rápida."
      scope={[
        'Frontend con React/Next.js de alto rendimiento',
        'Sistemas E-commerce a medida sin comisiones',
        'Plataformas interactivas y paneles de gestión (Dashboards)',
        'Optimización extrema para motores de búsqueda (SEO)',
        'Portales corporativos y Landing Pages de alta conversión'
      ]}
      process={[
        { title: 'Concepción Visual', desc: 'Diseñamos interfaces que cautivan y guían al usuario hacia el objetivo.' },
        { title: 'Ingeniería de Código', desc: 'Escribimos código limpio, modular y altamente eficiente.' },
        { title: 'Control de Calidad', desc: 'Realizamos pruebas de estrés y rendimiento en múltiples dispositivos.' }
      ]}
      examples={[
        { title: 'Portal E-commerce Global', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600' },
        { title: 'Panel de Gestión SaaS', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600' }
      ]}
    />
  );
}
