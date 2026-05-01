import ServicePageTemplate from '../../components/ServicePageTemplate';

export default function SaaS() {
  return (
    <ServicePageTemplate
      title="Productos SaaS"
      tagline="Software as a Service con Arquitectura Multi-tenant"
      description="Construimos plataformas por suscripción diseñadas para escalar a miles de usuarios con aislamiento de datos y gestión eficiente."
      scope={[
        'Arquitectura Multi-tenant segura y escalable',
        'Integración de pagos (Stripe, PayPal, MercadoPago)',
        'Sistemas de gestión de suscripciones y planes',
        'Infraestructura Serverless de bajo costo operativo',
        'APIs robustas para integración con terceros'
      ]}
      process={[
        { title: 'Definición de Tenants', desc: 'Estructuramos cómo se aislarán y gestionarán los datos de tus clientes.' },
        { title: 'Desarrollo de MVP', desc: 'Lanzamos rápido las funcionalidades núcleo para validar el mercado.' },
        { title: 'Iteración Continua', desc: 'Mejoramos el producto basándonos en métricas reales de uso.' }
      ]}
      examples={[
        { title: 'Plataforma CRM en la Nube', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600' },
        { title: 'Gestor de Tareas Colaborativo', image: 'https://images.unsplash.com/photo-1454165833772-d996d4951ee3?auto=format&fit=crop&q=80&w=600' }
      ]}
    />
  );
}
