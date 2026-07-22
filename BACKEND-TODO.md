# Backend — qué falta para que todo funcione

Checklist de lo que hay que cambiar/configurar en el backend para que el sitio y el panel de administración funcionen de verdad en producción, dejando MongoDB atrás y usando Supabase para todo (contenido editable, portafolio y formulario de contacto).

## 0. Punto de partida

- La migración de código de Mongo → Supabase **ya está hecha en la rama `ivan`**, no en `main`.
  - `main` y `origin/alex` todavía usan `mongodb` (`api/contact.ts` con `MongoClient`, variable `MONGODB_URI`, dependencia `"mongodb": "^7.2.0"` en `package.json`).
  - `ivan` ya tiene `api/contact.ts` reescrito con `@supabase/supabase-js`, el panel de administración completo, y `supabase/schema.sql` con todas las tablas.
- Ningún proyecto Supabase real está conectado todavía (ni en `ivan` ni en ningún lado) — todo corre en "modo demo local".

## 1. Dejar de usar MongoDB (obligatorio)

- [ ] Mergear `ivan` → `main` (o aplicar el mismo diff) para que el backend en producción deje de depender de Mongo.
- [ ] Sacar la dependencia `"mongodb": "^7.2.0"` de `package.json` una vez mergeado.
- [ ] Decidir qué pasa con los datos que ya están en MongoDB Atlas (los contactos que la gente ya envió por el formulario):
  - Opción A: exportarlos e importarlos a la tabla `contactos` de Supabase.
  - Opción B: arrancar la tabla vacía y dejar el histórico viejo solo en Mongo como respaldo.
- [ ] Una vez confirmado que Supabase funciona en producción, borrar la variable de entorno `MONGODB_URI` de Vercel y (si no se usa para nada más) dar de baja el cluster de Mongo Atlas.

## 2. Crear el proyecto Supabase real (obligatorio)

- [ ] Crear el proyecto en [supabase.com](https://supabase.com).
- [ ] Correr **todo** `supabase/schema.sql` en el SQL Editor del proyecto. Crea:
  - `site_content` (textos del sitio, FAQ y **servicios**, todo en una fila)
  - `portfolio_items` (proyectos del portafolio, ahora con columna `app_url` para el link de cada app)
  - `contactos` (reemplazo de la colección de Mongo)
  - el bucket de storage `portfolio-images` (público para lectura, protegido para escritura)
  - las políticas RLS de cada tabla
- [ ] Crear el usuario admin real en *Authentication → Users* (mientras no exista, el login del panel acepta cualquier email/contraseña porque está en modo demo).

## 3. Variables de entorno (obligatorio)

Hoy solo existe `.env.example`, no hay `.env` real ni local ni en Vercel.

- [ ] Crear `.env` local con:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Cargar las mismas 3 variables en Vercel → Project Settings → Environment Variables (Production **y** Preview).
- [ ] Sin `SUPABASE_SERVICE_ROLE_KEY`, `api/contact.ts` responde 500 "Configuración interna incompleta" — el formulario de contacto no funciona.

## 4. Arreglar el Content-Security-Policy de `vercel.json` (obligatorio)

El header CSP actual bloquea las llamadas a Supabase apenas se conecte:

```
connect-src 'self';
img-src 'self' data: https://images.unsplash.com https://speedcodelab.com;
```

- [ ] Agregar el dominio real del proyecto (`https://<tu-proyecto>.supabase.co`) a **`connect-src`** (si no, el navegador bloquea auth/lectura/escritura de datos).
- [ ] Agregar el mismo dominio a **`img-src`** (si no, las imágenes subidas al bucket `portfolio-images` no se muestran).

## 5. Deploy

- [ ] Pushear la rama `ivan` (o la rama resultante del merge) y verificar que Vercel esté apuntando a la rama correcta para producción.
- [ ] Después del primer deploy con Supabase conectado, probar en producción:
  - Login real en `/admin/login` con el usuario creado en el paso 2
  - Guardar cambios de contenido/servicios/FAQ y confirmar que persisten al recargar
  - Subir una imagen de portafolio y confirmar que se ve
  - Enviar el formulario de contacto y confirmar que aparece la fila en la tabla `contactos`

---

## Opcional / no bloquea que funcione

- El rate limiting del formulario de contacto (`api/contact.ts`) usa un `Map` en memoria. En Vercel (serverless) cada instancia tiene su propio estado y se resetea en cada cold start, así que el límite de "5 intentos cada 15 min" es aproximado, no exacto. No rompe nada, pero si en algún momento reciben spam real conviene mover ese conteo a una tabla de Supabase o a un servicio como Upstash.
- El bundle de JS del sitio pesa ~1.5 MB (por `three.js`/`@react-three/fiber` del fondo animado). No afecta el backend, pero si en algún momento se ve lento en producción, se puede cargar ese componente con `import()` dinámico.
