"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { PhaseTrack } from "@/components/PhaseTrack";
import { toggleArchiveProject } from "@/lib/actions";
import type { ProjectWithProgress } from "@/lib/types";

function formatEUR(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

const TABS = ["Activos", "Todos", "Archivados"] as const;

export function ProyectosList({ projects }: { projects: ProjectWithProgress[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Activos");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    let list = projects;
    if (tab === "Activos") list = list.filter((p) => !p.archived_at);
    if (tab === "Archivados") list = list.filter((p) => p.archived_at);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.client_name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [projects, tab, query]);

  const total = filtered.reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[32px] font-extrabold tracking-tight">Proyectos</div>
        <Link
          href="/proyectos/nuevo"
          aria-label="Nuevo proyecto"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-ink shadow-[0_6px_16px_rgba(10,10,10,.25)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </Link>
      </div>

      <div className="glass-flat mb-3 flex items-center gap-2 rounded-xl px-3.5 py-2.5">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="#8e8e93" strokeWidth="2.2" />
          <path d="M21 21L16.65 16.65" stroke="#8e8e93" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar cliente o proyecto"
          className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-2"
        />
      </div>

      <div className="glass-flat mb-4 flex rounded-[11px] p-[3px]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition ${
              tab === t ? "bg-ink text-white" : "text-[#6b6b70]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mb-2.5 flex items-baseline justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-2">
          {filtered.length} proyecto{filtered.length === 1 ? "" : "s"}
        </div>
        <div className="tabular-nums text-[12.5px] font-semibold text-ink-2">{formatEUR(total)}</div>
      </div>

      <div className="flex flex-col gap-2.5">
        {filtered.map((p) => {
          const days = daysUntil(p.deadline);
          return (
            <div key={p.id} className="glass rounded-card p-4 shadow-glass">
              <Link href={`/proyectos/${p.id}`} className="block">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[15.5px] font-bold tracking-tight">{p.name}</div>
                    <div className="mt-px text-xs text-ink-2">{p.client_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="tabular-nums text-[15px] font-bold">{formatEUR(Number(p.amount))}</div>
                    {days !== null && !p.archived_at && (
                      <div className={`mt-px text-[10.5px] font-semibold ${days <= 14 ? "text-urgent" : "text-ink-2"}`}>
                        {days < 0 ? "vencido" : `${days} días`}
                      </div>
                    )}
                  </div>
                </div>
                <PhaseTrack total={p.total_phases} done={p.done_phases} />
              </Link>
              <div className="flex items-center justify-between">
                <div className="text-[11px] text-ink-2">
                  Fase {Math.min(p.done_phases + 1, p.total_phases)} de {p.total_phases || 0}
                </div>
                <button
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => {
                      toggleArchiveProject(p.id, !p.archived_at);
                    })
                  }
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-black/5"
                  aria-label={p.archived_at ? "Reactivar" : "Archivar"}
                  title={p.archived_at ? "Reactivar" : "Archivar"}
                >
                  {p.archived_at ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12a9 9 0 1 0 3-6.7" stroke="#8e8e93" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M3 4v5h5" stroke="#8e8e93" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 7H20M6 7L7 20H17L18 7M10 11V16M14 11V16M9 7L10 4H14L15 7"
                        stroke="#8e8e93"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="glass rounded-card p-6 text-center text-sm text-ink-2 shadow-glass">
            No hay proyectos en "{tab}".
          </div>
        )}
      </div>
    </div>
  );
}
