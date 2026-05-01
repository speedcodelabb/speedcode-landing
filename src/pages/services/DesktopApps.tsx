import ServicePageTemplate from '../../components/ServicePageTemplate';

export default function DesktopApps() {
  return (
    <ServicePageTemplate
      title="Apps de Escritorio"
      tagline="Software Robusto Multiplataforma"
      description="Desarrollamos aplicaciones de escritorio que aprovechan el hardware local para ofrecer un rendimiento inigualable."
      scope={[
        'Software multiplataforma con Electron (Windows, macOS, Linux)',
        'Herramientas de productividad de uso intensivo',
        'Integración con hardware y periféricos locales',
        'Aplicaciones con modo offline y sincronización en la nube',
        'Sistemas de gestión interna corporativa'
      ]}
      process={[
        { title: 'Definición de Requerimientos', desc: 'Analizamos las necesidades de hardware y sistema operativo.' },
        { title: 'Desarrollo Core', desc: 'Implementamos la lógica de negocio con las mejores prácticas de seguridad.' },
        { title: 'Empaquetado y Distribución', desc: 'Configuramos instaladores y sistemas de actualización automática.' }
      ]}
      examples={[
        { title: 'Editor de Video Liviano', image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=600' },
        { title: 'Gestor de Inventarios Offline', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600' }
      ]}
    />
  );
}
