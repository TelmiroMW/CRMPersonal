# CRM Personal

App de gestión de clientes y proyectos — Next.js + Supabase.

## Puesta en marcha

1. **Base de datos**: en tu proyecto Supabase, abre el SQL Editor y pega el contenido de [`supabase/schema.sql`](supabase/schema.sql). Crea las tablas `clients`, `projects`, `phases`, la vista `projects_with_progress` y las políticas de RLS.

2. **Usuario admin**: en Supabase → Authentication → Users → "Add user", crea tu único usuario (email + contraseña). Es la cuenta con la que entrarás en la app; no hay registro público.

3. **Variables de entorno**: copia `.env.local.example` a `.env.local` y rellena con los valores de Supabase → Project Settings → API:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

4. **Instalar y arrancar en local**:

   ```bash
   npm install
   npm run dev
   ```

   Abre http://localhost:3000 y entra con el usuario que creaste en el paso 2.

## Deploy en Vercel

Importa este repositorio en Vercel ("Add New Project" → selecciona `CRMPersonal`) y añade las mismas dos variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en Project Settings → Environment Variables. Cada push a `main` despliega solo.

## Añadir a la pantalla de inicio (móvil)

Abre la URL desplegada en Safari (iOS) o Chrome (Android) → Compartir / menú → "Añadir a pantalla de inicio". La app tiene manifest e iconos configurados para instalarse como una PWA.

## Estructura

- `app/(dashboard)/` — Resumen, Proyectos, Clientes, Mapa (protegidas por `middleware.ts`)
- `app/login/` — pantalla de acceso
- `lib/actions.ts` — todas las mutaciones (crear/editar/archivar/borrar) como Server Actions
- `lib/supabase/` — clientes de Supabase (browser, servidor, middleware)
- `supabase/schema.sql` — esquema completo de la base de datos
- `design-canvas/` — los mockups `.dc.html` de los que salió el diseño (no forman parte de la app)
