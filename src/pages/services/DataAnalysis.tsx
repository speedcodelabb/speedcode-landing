import ServicePageTemplate from '../../components/ServicePageTemplate';

export default function DataAnalysis() {
  return (
    <ServicePageTemplate
      title="Análisis de Datos"
      tagline="Decisiones Inteligentes Basadas en Evidencia"
      description="Transformamos montañas de datos en información procesable y visualizaciones que cuentan una historia clara para tu negocio."
      scope={[
        'Dashboards interactivos en tiempo real',
        'Visualización de datos complejos con D3.js y Recharts',
        'Modelado de datos para BI (Business Intelligence)',
        'Integración de múltiples fuentes de datos',
        'Reportes automatizados y predicción de tendencias'
      ]}
      process={[
        { title: 'Extracción y Limpieza', desc: 'Preparamos los datos para asegurar que la información sea fidedigna.' },
        { title: 'Análisis Exploratorio', desc: 'Descubrimos patrones y correlaciones ocultas en la información.' },
        { title: 'Diseño de Visualización', desc: 'Creamos interfaces intuitivas para el consumo de la información.' }
      ]}
      examples={[
        { title: 'Dashboard de Ventas Regional', image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=600' },
        { title: 'Monitor de Metas en Tiempo Real', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600' }
      ]}
    />
  );
}
