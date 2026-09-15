"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateProject,
  createPhase,
  togglePhase,
  deletePhase,
  deleteProject,
  toggleArchiveProject,
} from "@/lib/actions";
import type { Phase, Project } from "@/lib/types";

function formatEUR(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string | null) {
  if (!d) return "Sin fecha";
  return new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export function ProjectDetail({
  project,
  clientName,
  phases,
}: {
  project: Project;
  clientName: string;
  phases: Phase[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [addingPhase, setAddingPhase] = useState(false);
  const [isPending, startTransition] = useTransition();

  const doneCount = phases.filter((p) => p.completed_at).length;
  const currentPhase = phases.find((p) => !p.completed_at);
  const isRecurring = project.billing_type === "recurring";

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/proyectos")}
          className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-white/70 shadow-[0_1px_2px_rgba(20,20,15,.05)]"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[22px] font-extrabold tracking-tight">{project.name}</div>
          <div className="flex items-center gap-1.5 text-[12.5px] text-ink-2">
            {clientName}
            {isRecurring && (
              <span className="rounded-full bg-accent/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-accent">
                Mensualidad
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() =>
            startTransition(() => {
              if (confirm(`¿Eliminar "${project.name}"? Esto borra también sus fases.`)) {
                deleteProject(project.id);
              }
            })
          }
          className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-white/70 shadow-[0_1px_2px_rgba(20,20,15,.05)]"
          aria-label="Eliminar proyecto"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M4 7H20M6 7L7 20H17L18 7M10 11V16M14 11V16M9 7L10 4H14L15 7" stroke="#0a0a0a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {editing ? (
        <form
          action={async (fd) => {
            await updateProject(project.id, fd);
            setEditing(false);
          }}
          className="glass mb-4 flex flex-col gap-3 rounded-card p-4 shadow-glass"
        >
          <input type="hidden" name="billing_type" value={project.billing_type} />
          <input
            name="name"
            defaultValue={project.name}
            className="w-full rounded-xl border border-border bg-white/70 px-3 py-2 text-[15px] outline-none focus:border-accent"
          />
          {isRecurring ? (
            <>
              <input
                name="monthly_amount"
                type="number"
                step="0.01"
                defaultValue={project.monthly_amount ?? 0}
                placeholder="Cuota mensual"
                className="w-full rounded-xl border border-border bg-white/70 px-3 py-2 text-[15px] outline-none focus:border-accent"
              />
              <div className="flex gap-2.5">
                <input
                  name="recurring_start"
                  type="date"
                  defaultValue={project.recurring_start ?? ""}
                  className="w-full rounded-xl border border-border bg-white/70 px-3 py-2 text-[15px] outline-none focus:border-accent"
                />
                <input
                  name="recurring_end"
                  type="date"
                  defaultValue={project.recurring_end ?? ""}
                  placeholder="Fin (en curso)"
                  className="w-full rounded-xl border border-border bg-white/70 px-3 py-2 text-[15px] outline-none focus:border-accent"
                />
              </div>
            </>
          ) : (
            <div className="flex gap-2.5">
              <input
                name="amount"
                type="number"
                step="0.01"
                defaultValue={project.amount}
                className="w-full rounded-xl border border-border bg-white/70 px-3 py-2 text-[15px] outline-none focus:border-accent"
              />
              <input
                name="deadline"
                type="date"
                defaultValue={project.deadline ?? ""}
                className="w-full rounded-xl border border-border bg-white/70 px-3 py-2 text-[15px] outline-none focus:border-accent"
              />
            </div>
          )}
          <div className="flex gap-2">
            <button type="submit" className="flex-1 rounded-full bg-ink py-2.5 text-sm font-semibold text-white">
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 rounded-full bg-black/5 py-2.5 text-sm font-semibold text-ink-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-4 flex gap-2.5">
          <button onClick={() => setEditing(true)} className="glass flex-1 rounded-card p-3 text-left shadow-glass">
            <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-2">
              {isRecurring ? "Cuota mensual" : "Ingreso total"}
            </div>
            <div className="tabular-nums flex items-center gap-1.5 text-[16px] font-bold">
              {isRecurring ? `${formatEUR(Number(project.monthly_amount))}/mes` : formatEUR(Number(project.amount))}{" "}
              <span className="opacity-35">✎</span>
            </div>
          </button>
          <button onClick={() => setEditing(true)} className="glass flex-1 rounded-card p-3 text-left shadow-glass">
            <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-2">
              {isRecurring ? "Duración" : "Entrega"}
            </div>
            <div className="flex items-center gap-1.5 text-[15px] font-bold">
              {isRecurring
                ? `${formatDate(project.recurring_start)} – ${project.recurring_end ? formatDate(project.recurring_end) : "en curso"}`
                : formatDate(project.deadline)}{" "}
              <span className="opacity-35">✎</span>
            </div>
          </button>
        </div>
      )}

      <button
        onClick={() =>
          startTransition(() => toggleArchiveProject(project.id, !project.archived_at))
        }
        className="mb-4 text-[13px] font-semibold text-accent"
      >
        {project.archived_at ? "Reactivar proyecto" : "Archivar proyecto"}
      </button>

      <div className="mb-2.5 flex items-baseline justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-2">Fases</div>
        <button onClick={() => setAddingPhase((v) => !v)} className="text-[13px] font-semibold text-accent">
          + Añadir fase
        </button>
      </div>

      {addingPhase && (
        <form
          action={async (fd) => {
            await createPhase(project.id, fd);
            setAddingPhase(false);
          }}
          className="glass mb-3 flex flex-col gap-2.5 rounded-card p-4 shadow-glass"
        >
          <input
            name="name"
            required
            placeholder="Nombre de la fase"
            className="w-full rounded-xl border border-border bg-white/70 px-3 py-2 text-[14px] outline-none focus:border-accent"
          />
          <div className="flex gap-2">
            <input
              name="deadline"
              type="date"
              className="w-full rounded-xl border border-border bg-white/70 px-3 py-2 text-[14px] outline-none focus:border-accent"
            />
            <button type="submit" className="flex-shrink-0 rounded-full bg-ink px-5 py-2 text-[13px] font-semibold text-white">
              Añadir
            </button>
          </div>
        </form>
      )}

      <div className="glass rounded-card px-4 pb-1.5 pt-4 shadow-glass">
        {phases.length === 0 && (
          <div className="pb-4 text-center text-sm text-ink-2">Todavía no hay fases.</div>
        )}
        {phases.map((phase, i) => {
          const isDone = !!phase.completed_at;
          const isCurrent = !isDone && phase.id === currentPhase?.id;
          const isLast = i === phases.length - 1;
          return (
            <div key={phase.id} className="flex gap-3.5">
              <div className="flex w-[22px] flex-shrink-0 flex-col items-center">
                <button
                  onClick={() =>
                    startTransition(() => togglePhase(phase.id, project.id, !isDone))
                  }
                  className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: isDone ? "#0a0a0a" : "#fff",
                    border: isCurrent ? "2.5px solid #2f6fed" : isDone ? "none" : "2px solid #ececea",
                  }}
                  aria-label={isDone ? "Marcar como pendiente" : "Marcar como completada"}
                >
                  {isDone && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13L9.5 17.5L19 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {isCurrent && <div className="h-2 w-2 rounded-full bg-accent" />}
                </button>
                {!isLast && (
                  <div
                    className="my-0.5 w-[2px] flex-1"
                    style={{ background: isDone ? "#0a0a0a" : "#ececea" }}
                  />
                )}
              </div>
              <div className={`flex-1 ${isLast ? "pb-4" : "pb-5"}`}>
                <div className="flex items-center justify-between">
                  <div className={`text-sm font-semibold ${isCurrent ? "text-accent" : isDone ? "" : "text-ink-3"}`}>
                    {phase.name}
                  </div>
                  <button
                    onClick={() =>
                      startTransition(() => deletePhase(phase.id, project.id))
                    }
                    className="text-ink-3 hover:text-urgent"
                    aria-label="Eliminar fase"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <div className={`mt-0.5 text-xs ${isDone || isCurrent ? "text-ink-2" : "text-ink-3"}`}>
                  {isDone
                    ? `Completada · ${formatDate(phase.completed_at)}`
                    : `Deadline ${formatDate(phase.deadline)}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
