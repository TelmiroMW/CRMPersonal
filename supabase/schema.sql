-- ============================================================
-- Esquema inicial: gestión de clientes y proyectos
-- Ejecutar en el SQL Editor de Supabase (proyecto nuevo/propio)
-- ============================================================

-- Requiere pgcrypto para gen_random_uuid() (ya viene activado por defecto en Supabase)
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- clients
-- ------------------------------------------------------------
create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name        text not null,
  country     text,              -- nombre del país, ej. "España"
  country_code text,             -- ISO 3166-1 alpha-2, ej. "ES" — para el mapa
  created_at  timestamptz not null default now()
);

comment on column public.clients.country_code is 'Código ISO de 2 letras usado por la pantalla de Mapa';

-- ------------------------------------------------------------
-- projects
-- ------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_id   uuid not null references public.clients(id) on delete cascade,
  name        text not null,
  amount      numeric(12,2) not null default 0,   -- ingreso total en EUR
  deadline    date,                                 -- fecha de entrega final
  archived_at timestamptz,                          -- null = activo
  created_at  timestamptz not null default now()
);

create index if not exists projects_client_id_idx on public.projects(client_id);
create index if not exists projects_user_id_idx on public.projects(user_id);

-- ------------------------------------------------------------
-- phases  (fases de un proyecto — el % de completación se calcula
--          en el cliente/consulta: fases con completed_at / total)
-- ------------------------------------------------------------
create table if not exists public.phases (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id    uuid not null references public.projects(id) on delete cascade,
  name          text not null,
  order_index   int not null default 0,
  deadline      date,
  completed_at  timestamptz,       -- null = pendiente
  created_at    timestamptz not null default now()
);

create index if not exists phases_project_id_idx on public.phases(project_id);
create unique index if not exists phases_project_order_idx on public.phases(project_id, order_index);

-- ------------------------------------------------------------
-- Vista de conveniencia: proyecto + % de completación + cliente
-- ------------------------------------------------------------
create or replace view public.projects_with_progress as
select
  p.*,
  c.name as client_name,
  c.country,
  c.country_code,
  coalesce(ph.total_phases, 0) as total_phases,
  coalesce(ph.done_phases, 0) as done_phases,
  case when coalesce(ph.total_phases, 0) = 0 then 0
       else round(100.0 * ph.done_phases / ph.total_phases)
  end as progress_pct
from public.projects p
join public.clients c on c.id = p.client_id
left join (
  select project_id,
         count(*) as total_phases,
         count(*) filter (where completed_at is not null) as done_phases
  from public.phases
  group by project_id
) ph on ph.project_id = p.id;

-- ------------------------------------------------------------
-- Row Level Security — todo pertenece únicamente al usuario admin
-- ------------------------------------------------------------
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.phases enable row level security;

create policy "clients: solo el dueño" on public.clients
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "projects: solo el dueño" on public.projects
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "phases: solo el dueño" on public.phases
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ------------------------------------------------------------
-- Datos de ejemplo (opcional — bórralo si no lo quieres)
-- Sustituye 'TU_USER_ID' por tu uid real (Authentication > Users)
-- ------------------------------------------------------------
-- insert into public.clients (user_id, name, country, country_code) values
--   ('TU_USER_ID', 'Kimovil', 'España', 'ES'),
--   ('TU_USER_ID', 'LTA Finance', 'Alemania', 'DE');
