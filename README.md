# Speedcode Landing

Landing pública y CMS privado de Speedcode Lab. La rama de integración es `ivan`; `main` debe recibirla únicamente después de superar CI, Preview y la validación manual de publicación/restauración.

## Requisitos y desarrollo

- Node.js `24.x`.
- pnpm `10.15.0` mediante Corepack.
- Un proyecto Supabase de staging. No existe un modo demo administrativo.

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

La landing usa una copia base si la lectura pública de Supabase falla. El panel, en cambio, se cierra y muestra el error real si Supabase o sus variables faltan.

## Variables

Variables públicas de Vite:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_TURNSTILE_SITE_KEY`

Variables exclusivas del servidor:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TURNSTILE_SECRET_KEY`
- `RATE_LIMIT_HASH_SECRET` (secreto aleatorio largo para el HMAC de IP)
- `RESEND_API_KEY`
- `RESEND_FROM`
- `CONTACT_NOTIFICATION_TO`
- `ADMIN_GATE_USER`
- `ADMIN_GATE_PASSWORD`

Nunca se debe usar el prefijo `VITE_` en claves privadas. En Vercel deben existir grupos distintos para Preview y Production. Preview apunta a Supabase staging y a un destinatario de Resend de prueba; Production apunta exclusivamente a recursos productivos.

## Supabase

Crear dos proyectos separados, staging y producción. En ambos:

1. Aplicar, en orden, los archivos de `supabase/migrations` con Supabase CLI.
2. Configurar las variables locales del proyecto y ejecutar `pnpm db:seed`. La semilla se niega a correr si `site_content` ya tiene contenido, para no pisar la web publicada.
3. En Authentication > Sign In / Providers desactivar `Allow new users to sign up` y dejar **activado** el proveedor Email (sin él nadie puede iniciar sesión). Con la CLI: `[auth] enable_signup = false` y `[auth.email] enable_signup = true` en un `config.toml` con la URL real del entorno, aplicado con `supabase config push --project-ref <ref>`.
4. Crear el usuario administrador manualmente en Authentication > Users.
5. Copiar su UUID a `ADMIN_USER_ID` y ejecutar `pnpm db:add-admin` con service role.
6. Comprobar que el bucket público `site-media` fue creado con límite de 5 MB y solo acepta JPEG, PNG, WebP y AVIF.

Las migraciones crean RLS, funciones con `search_path` fijo, permisos mínimos, publicación atómica con validación mínima del documento en el servidor, historial de 20 versiones, rate limiting persistente y limpieza diaria de leads archivados con más de 180 días. El rol anónimo solo puede leer `site_content` y media pública; autenticarse no otorga permisos administrativos sin una fila activa en `admin_users`.

Para validar localmente:

```bash
supabase start -x studio,imgproxy,edge-runtime,logflare,vector,supavisor
supabase db reset
supabase db lint --local --fail-on warning
supabase test db
```

`supabase test db` ejecuta los tests pgTAP de `supabase/tests`: permisos de las funciones `SECURITY DEFINER`, RLS por rol y el ciclo guardar, publicar y restaurar.

## Acceso administrativo

El panel vive en `/gestion-speedcode` y no tiene enlaces desde la landing. `/admin` y cualquier descendiente devuelven 404. Vercel Routing Middleware exige primero HTTP Basic y, después, la aplicación exige sesión Supabase y allowlist por UUID.

Si `ADMIN_GATE_USER` o `ADMIN_GATE_PASSWORD` faltan, Preview y Production responden 503 y nunca omiten la barrera. Las credenciales Basic no reemplazan la cuenta Supabase.

Flujo editorial:

1. Editar contenido o portafolio.
2. Guardar crea una nueva revisión del borrador; no modifica la web.
3. Vista previa representa el borrador sin publicarlo.
4. Publicar valida `SiteDocumentV1`, crea un snapshot y reemplaza toda la web en una transacción.
5. Restaurar copia una versión histórica al borrador. Hay que publicarla explícitamente.

Si dos administradores editan la misma revisión, la segunda escritura falla por conflicto y debe recargar antes de continuar.

## Contactos y servicios externos

El formulario abre WhatsApp durante el gesto del usuario y, en paralelo, llama `POST /api/contact`. El servidor valida Turnstile, limita a cinco solicitudes cada quince minutos mediante HMAC de IP, verifica el tipo de proyecto contra el contenido publicado, guarda el lead y alerta con Resend. Nunca se guarda la IP cruda. Si Resend falla, el lead permanece y el panel permite reintentar.

En Cloudflare Turnstile registrar el dominio productivo y los dominios Preview necesarios. En Resend verificar el dominio usado por `RESEND_FROM`. Staging nunca debe usar el destinatario productivo.

## CSP y Vercel

`vercel.json` permite Supabase Storage/API y Turnstile. La CSP enumera los dos proyectos Supabase exactos: staging (`qrhrgswtephdhvduywnm`) y producción (`htwixdjjlvithjmfwyiw`). Si se cambia de proyecto, hay que actualizar `img-src` y `connect-src`.

Configurar Node `24.x` y pnpm desde `package.json`. Aplicar todos los secretos por entorno. El middleware depende del runtime de Vercel; no confiar en `vite preview` para validar HTTP Basic.

## Calidad, despliegue y rollback

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit --prod --audit-level high
pnpm test:e2e
```

La CI repite estas verificaciones, valida las migraciones y sus permisos (pgTAP) en Supabase local, ejecuta Gitleaks y lanza Playwright contra deployments Preview. El gate de dependencias admite cero vulnerabilidades altas o críticas de producción.

Los Preview están detrás de Vercel Deployment Protection: configurar en GitHub Actions `VERCEL_AUTOMATION_BYPASS_SECRET` (Vercel > Settings > Deployment Protection > Protection Bypass for Automation) para que Playwright reciba la aplicación y no la página de acceso de Vercel. Para que Preview pruebe también el login Supabase y la navegación administrativa, configurar además `PREVIEW_ADMIN_GATE_USER`, `PREVIEW_ADMIN_GATE_PASSWORD`, `E2E_ADMIN_EMAIL` y `E2E_ADMIN_PASSWORD`. La cuenta E2E debe existir únicamente en staging y estar allowlisted.

Despliegue recomendado:

1. Aplicar migraciones y semilla en staging.
2. Configurar Turnstile, Resend de prueba y variables de Preview.
3. Probar login doble, edición, media, publicación, restauración y contactos.
4. Aplicar exactamente las mismas migraciones en producción, crear el admin real y cargar secretos productivos.
5. Aprobar Preview, hacer squash de `ivan` hacia `main` y ejecutar smoke tests tras desplegar.

El workflow `Supabase keep-alive` lee cada día el contenido publicado de staging y producción con la clave anónima (variables de repositorio `SUPABASE_*_URL` y `SUPABASE_*_ANON_KEY`), para que el plan Free no pause los proyectos tras 7 días sin actividad. Si falla, revisar el estado del proyecto en Supabase.

Ante una falla de aplicación, restaurar el deployment anterior en Vercel. Ante contenido incorrecto, restaurar la versión anterior desde el panel y publicarla. Las migraciones deben seguir siendo aditivas; no ejecutar rollbacks destructivos en producción.
