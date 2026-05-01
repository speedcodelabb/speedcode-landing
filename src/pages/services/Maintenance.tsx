import ServicePageTemplate from '../../components/ServicePageTemplate';

export default function Maintenance() {
  return (
    <ServicePageTemplate
      title="Soporte y Mantenimiento"
      tagline="Evolución y Estabilidad para tus Sistemas"
      description="Modernizamos código legado y optimizamos aplicaciones existentes para que nunca dejen de funcionar y sigan siendo competitivas."
      scope={[
        'Modernización de código (Refactoring) y stacks antiguos',
        'Optimización de performance y tiempos de carga',
        'Corrección de bugs críticos y parches de seguridad',
        'Actualización de librerías y dependencias (Vulnerabilidades)',
        'Monitoreo proactivo 24/7 y planes de contingencia'
      ]}
      process={[
        { title: 'Auditoría de Relevancia', desc: 'Evaluamos el estado actual del código y priorizamos mejoras.' },
        { title: 'Plan de Refactorización', desc: 'Establecemos una hoja de ruta para modernizar sin detener la operación.' },
        { title: 'Aseguramiento de Calidad', desc: 'Implementamos suites de tests automáticos para prevenir regresiones.' }
      ]}
      examples={[
        { title: 'Optimización de Legacy ERP', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600' },
        { title: 'Parche de Seguridad Crítico', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600' }
      ]}
    />
  );
}
