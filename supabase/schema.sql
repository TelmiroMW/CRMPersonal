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
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_id       uuid not null references public.clients(id) on delete cascade,
  name            text not null,
  billing_type    text not null default 'one_off'   -- 'one_off' (precio total) | 'recurring' (mensualidad)
                    check (billing_type in ('one_off', 'recurring')),
  amount          numeric(12,2) not null default 0,   -- ingreso total en EUR (proyectos 'one_off')
  monthly_amount  numeric(12,2),                      -- cuota mensual en EUR (proyectos 'recurring')
  recurring_start date,                                -- inicio del mantenimiento (proyectos 'recurring')
  recurring_end   date,                                -- fin del mantenimiento; null = en curso, sin fecha de fin
  deadline        date,                                 -- fecha de entrega final (proyectos 'one_off')
  archived_at     timestamptz,                          -- null = activo
  created_at      timestamptz not null default now()
);

-- Si la tabla ya existía de antes de que existieran las mensualidades:
alter table public.projects add column if not exists billing_type text not null default 'one_off';
alter table public.projects add column if not exists monthly_amount numeric(12,2);
alter table public.projects add column if not exists recurring_start date;
alter table public.projects add column if not exists recurring_end date;
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'projects_billing_type_check'
  ) then
    alter table public.projects
      add constraint projects_billing_type_check check (billing_type in ('one_off', 'recurring'));
  end if;
end $$;

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
-- IMPORTANTE: aunque aquí ponga "p.*", Postgres CONGELA la lista de
-- columnas en el momento de crear la vista — si luego añades una
-- columna a projects (como billing_type/monthly_amount), la vista NO
-- la recoge sola. Y como las columnas nuevas se añaden vía ALTER TABLE
-- (al final de la tabla física), un simple "CREATE OR REPLACE VIEW" ni
-- siquiera vale para arreglarlo: Postgres exige que cada posición de
-- columna mantenga el mismo nombre que tenía, y las nuevas columnas se
-- cuelan en medio (antes de client_name) — hay que DROP + CREATE.
-- ------------------------------------------------------------
drop view if exists public.projects_with_progress;
create view public.projects_with_progress as
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
-- Permisos a nivel de tabla para el rol "authenticated"
-- Postgres comprueba el GRANT sobre la tabla ANTES de evaluar las
-- políticas de RLS de arriba. Al crear las tablas a mano (SQL Editor,
-- no el editor visual de Supabase) este permiso no se concede solo —
-- sin él, cualquier insert/select da "permission denied for table X"
-- aunque las políticas de RLS sean correctas.
-- ------------------------------------------------------------
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.clients to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.phases to authenticated;
grant select on public.projects_with_progress to authenticated;

-- ------------------------------------------------------------
-- Datos de ejemplo (opcional — bórralo si no lo quieres)
-- Sustituye 'TU_USER_ID' por tu uid real (Authentication > Users)
-- ------------------------------------------------------------
-- insert into public.clients (user_id, name, country, country_code) values
--   ('TU_USER_ID', 'Kimovil', 'España', 'ES'),
--   ('TU_USER_ID', 'LTA Finance', 'Alemania', 'DE');
