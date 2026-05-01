import ServicePageTemplate from '../../components/ServicePageTemplate';

export default function Automation() {
  return (
    <ServicePageTemplate
      title="Automatización"
      tagline="Optimización Radical de Flujos"
      description="Liberamos el potencial de tu equipo automatizando tareas repetitivas mediante bots inteligentes y flujos de trabajo optimizados."
      scope={[
        'Bots inteligentes para atención al cliente',
        'Automatización de procesos contables y administrativos',
        'Integración de flujos mediante n8n o Zapier para empresas',
        'Web Scraping y extracción de datos automatizada',
        'Sistemas de alertas y monitoreo reactivo'
      ]}
      process={[
        { title: 'Auditoría de Procesos', desc: 'Identificamos las áreas críticas donde la automatización generará el mayor Retorno de Inversión (ROI).' },
        { title: 'Diseño de Arquitectura', desc: 'Estructuramos los flujos de datos y definimos las herramientas necesarias.' },
        { title: 'Despliegue y Pruebas', desc: 'Implementamos la solución en un entorno controlado antes del lanzamiento final.' }
      ]}
      examples={[
        { title: 'Bot de Soporte Multi-canal', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=600' },
        { title: 'Extracción de Datos Masiva', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=600' }
      ]}
    />
  );
}
