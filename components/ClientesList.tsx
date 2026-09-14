"use client";

import { useState } from "react";
import Link from "next/link";
import { flagStyle } from "@/lib/countries";
import type { Client, Project } from "@/lib/types";

function formatEUR(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

type ClientRow = Client & { projects: Project[] };

export function ClientesList({ clients }: { clients: ClientRow[] }) {
  const [openId, setOpenId] = useState<string | null>(clients[0]?.id ?? null);

  const totalBilled = clients.reduce(
    (sum, c) => sum + c.projects.reduce((s, p) => s + Number(p.amount), 0),
    0
  );

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="text-[32px] font-extrabold tracking-tight">Clientes</div>
        <Link
          href="/clientes/nuevo"
          aria-label="Nuevo cliente"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-ink shadow-[0_6px_16px_rgba(10,10,10,.25)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </Link>
      </div>
      <div className="mb-4 text-[12.5px] text-ink-2">
        {clients.length} cliente{clients.length === 1 ? "" : "s"} · {formatEUR(totalBilled)} facturados en total
      </div>

      {clients.length === 0 && (
        <div className="glass rounded-card p-6 text-center text-sm text-ink-2 shadow-glass">
          Aún no tienes clientes.{" "}
          <Link href="/clientes/nuevo" className="font-semibold text-accent">
            Crea el primero
          </Link>
          .
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {clients.map((c) => {
          const open = c.id === openId;
          const total = c.projects.reduce((s, p) => s + Number(p.amount), 0);
          return (
            <div key={c.id} className="glass overflow-hidden rounded-card shadow-glass">
              <button
                onClick={() => setOpenId(open ? null : c.id)}
                className="flex w-full items-center gap-3 p-4 text-left transition active:scale-[0.985]"
              >
                <div
                  className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-[13px] shadow-[0_5px_12px_rgba(10,10,10,.14)] ring-1 ring-black/5"
                  style={{ background: flagStyle(c.country_code) }}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15.5px] font-bold">{c.name}</div>
                  <div className="text-xs text-ink-2">
                    {c.projects.length} proyecto{c.projects.length === 1 ? "" : "s"} · {c.country ?? "Sin país"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="tabular-nums text-[15px] font-bold">{formatEUR(total)}</div>
                  <div className="text-[10.5px] text-ink-2">facturado</div>
                </div>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="ml-1 flex-shrink-0 transition"
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <path d="M6 9L12 15L18 9" stroke="#9a9a9e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300"
                style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  {c.projects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/proyectos/${p.id}`}
                      className="flex items-center justify-between border-t border-black/[0.06] py-2.5 pl-[68px] pr-4 text-sm"
                    >
                      <span className="flex items-center text-ink-2">
                        <span className="mr-2 h-[5px] w-[5px] rounded-full bg-ink-3" />
                        {p.name}
                      </span>
                      <span className="tabular-nums font-bold">{formatEUR(Number(p.amount))}</span>
                    </Link>
                  ))}
                  {c.projects.length === 0 && (
                    <div className="border-t border-black/[0.06] py-2.5 pl-[68px] pr-4 text-sm text-ink-2">
                      Sin proyectos todavía.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
