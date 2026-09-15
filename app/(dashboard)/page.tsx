import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PhaseTrack } from "@/components/PhaseTrack";
import { signOut } from "@/lib/actions";
import { InstallPrompt } from "@/components/InstallPrompt";
import { splitIncome } from "@/lib/income";
import type { ProjectWithProgress } from "@/lib/types";

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  return diff;
}

function formatEUR(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default async function ResumenPage() {
  const supabase = await createClient();

  const { data: active } = await supabase
    .from("projects_with_progress")
    .select("*")
    .is("archived_at", null)
    .order("deadline", { ascending: true, nullsFirst: false });

  const projects = (active ?? []) as ProjectWithProgress[];
  const { oneOff, recurring, total: totalIncome } = splitIncome(projects);

  const { count: clientsCount } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true });

  const { data: lastCompleted } = await supabase
    .from("phases")
    .select("name, completed_at, project_id, projects(name, client_id, clients(name))")
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[15px] font-semibold">Hola, Telmo</div>
          <div className="mt-px text-xs text-ink-2">{today}</div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            aria-label="Cerrar sesión"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 shadow-[0_1px_2px_rgba(20,20,15,.05),0_4px_12px_rgba(20,20,15,.06)]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" stroke="#0a0a0a" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M15 8l4 4-4 4M19 12H9" stroke="#0a0a0a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>

      <InstallPrompt />

      <div className="mb-1 text-[11.5px] font-semibold uppercase tracking-wide text-ink-2">
        Ingresos activos · hasta fin de año
      </div>
      <div className="tabular-nums mb-1.5 text-[44px] font-extrabold leading-none tracking-tight">
        {formatEUR(totalIncome)}
      </div>
      {recurring > 0 && (
        <div className="tabular-nums mb-1 flex items-center gap-1.5 text-sm">
          <span className="font-semibold text-ink">{formatEUR(oneOff)}</span>
          <span className="text-ink-2">de proyectos</span>
          <span className="text-ink-3">·</span>
          <span className="font-semibold text-ink">{formatEUR(recurring)}</span>
          <span className="text-ink-2">de mensualidades</span>
        </div>
      )}
      <div className="mb-5 text-sm text-ink-2">
        {projects.length} proyecto{projects.length === 1 ? "" : "s"} activo
        {projects.length === 1 ? "" : "s"} · {clientsCount ?? 0} cliente{clientsCount === 1 ? "" : "s"}
      </div>

      <div className="mb-2.5 mt-4 flex items-baseline justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-2">En marcha</div>
        <Link href="/proyectos" className="text-[13px] font-semibold text-accent">
          Ver todos
        </Link>
      </div>

      {projects.length === 0 && (
        <div className="glass rounded-card p-6 text-center text-sm text-ink-2 shadow-glass">
          Aún no tienes proyectos activos.{" "}
          <Link href="/proyectos/nuevo" className="font-semibold text-accent">
            Crea el primero
          </Link>
          .
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {projects.slice(0, 5).map((p) => {
          const days = daysUntil(p.deadline);
          return (
            <Link
              key={p.id}
              href={`/proyectos/${p.id}`}
              className="glass block rounded-card p-4 shadow-glass"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[16px] font-bold tracking-tight">{p.name}</div>
                  <div className="mt-px text-[12.5px] text-ink-2">{p.client_name}</div>
                </div>
                <div className="text-right">
                  <div className="tabular-nums text-[16px] font-bold">
                    {p.billing_type === "recurring"
                      ? `${formatEUR(Number(p.monthly_amount))}/mes`
                      : formatEUR(Number(p.amount))}
                  </div>
                  {days !== null && (
                    <div className={`mt-px text-[11px] font-semibold ${days <= 14 ? "text-urgent" : "text-ink-2"}`}>
                      {days < 0 ? "vencido" : `${days} días`}
                    </div>
                  )}
                </div>
              </div>
              <PhaseTrack total={p.total_phases} done={p.done_phases} />
              <div className="text-[11px] text-ink-2">
                Fase {Math.min(p.done_phases + 1, p.total_phases)} de {p.total_phases || 0}
              </div>
            </Link>
          );
        })}
      </div>

      {lastCompleted && (
        <div className="glass mt-2.5 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-glass">
          <div className="flex h-6.5 w-6.5 flex-shrink-0 items-center justify-center rounded-full bg-income/[0.18]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 13L9.5 17.5L19 6" stroke="#1e9a5c" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-[12.5px] text-ink-2">
            <strong className="font-semibold text-ink">{lastCompleted.name}</strong> completada
            {/* @ts-expect-error - nested select shape from Supabase */}
            {lastCompleted.projects?.clients?.name ? ` en ${lastCompleted.projects.clients.name}` : ""}
          </div>
        </div>
      )}
    </div>
  );
}
