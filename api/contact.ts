import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const ALLOWED_ORIGINS = [
  'https://speedcodelab.com',
  'https://speedcodelab.vercel.app',
];

// Límite simple por IP (en memoria — se resetea por cold start)
const ipRequestMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequestMap.get(ip);
  if (!entry || now > entry.resetTime) {
    ipRequestMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

function sanitize(str: unknown, maxLen = 500): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen).replace(/[<>]/g, '');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const ALLOWED_TIPOS = [
  'Desarrollo Web / SaaS',
  'App de Escritorio',
  'Automatizacion',
  'Analisis de Datos',
  'Consultoria Tecnologica',
  'Otro',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  if (!supabaseUrl || !serviceRoleKey) return res.status(500).json({ error: 'Configuración interna incompleta' });

  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Demasiados intentos. Intentá en 15 minutos.' });
  }

  // Content-Type check
  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(415).json({ error: 'Content-Type debe ser application/json' });
  }

  const nombre = sanitize(req.body?.nombre, 100);
  const email = sanitize(req.body?.email, 200);
  const tipoProyecto = sanitize(req.body?.tipoProyecto, 100);
  const mensaje = sanitize(req.body?.mensaje, 2000);

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  if (tipoProyecto && !ALLOWED_TIPOS.includes(tipoProyecto)) {
    return res.status(400).json({ error: 'Tipo de proyecto inválido' });
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { error } = await supabase.from('contactos').insert({
      nombre,
      email,
      tipo_proyecto: tipoProyecto || 'No especificado',
      mensaje,
      ip,
    });

    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error Supabase:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
