"use client";

import { useState } from "react";
import { createProject } from "@/lib/actions";
import type { BillingType } from "@/lib/types";

export function NuevoProyectoForm({ clients }: { clients: { id: string; name: string }[] }) {
  const [billingType, setBillingType] = useState<BillingType>("one_off");
  const isRecurring = billingType === "recurring";

  return (
    <form action={createProject} className="glass flex flex-col gap-4 rounded-card p-5 shadow-glass">
      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-2">
          Nombre del proyecto
        </label>
        <input
          name="name"
          required
          placeholder={isRecurring ? "Mantenimiento web" : "Rediseño web"}
          className="w-full rounded-xl border border-border bg-white/70 px-3.5 py-2.5 text-[15px] outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-2">
          Cliente
        </label>
        <select
          name="client_id"
          required
          className="w-full rounded-xl border border-border bg-white/70 px-3.5 py-2.5 text-[15px] outline-none focus:border-accent"
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-2">
          Tipo de ingreso
        </label>
        <input type="hidden" name="billing_type" value={billingType} />
        <div className="glass-flat flex rounded-[11px] p-[3px]">
          <button
            type="button"
            onClick={() => setBillingType("one_off")}
            className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition ${
              billingType === "one_off" ? "bg-ink text-white" : "text-[#6b6b70]"
            }`}
          >
            Proyecto único
          </button>
          <button
            type="button"
            onClick={() => setBillingType("recurring")}
            className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition ${
              billingType === "recurring" ? "bg-ink text-white" : "text-[#6b6b70]"
            }`}
          >
            Mensualidad
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-2">
            {isRecurring ? "Cuota mensual (€)" : "Ingreso total (€)"}
          </label>
          <input
            name={isRecurring ? "monthly_amount" : "amount"}
            type="number"
            min="0"
            step="0.01"
            required
            placeholder={isRecurring ? "150" : "12000"}
            className="w-full rounded-xl border border-border bg-white/70 px-3.5 py-2.5 text-[15px] outline-none focus:border-accent"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-2">
            {isRecurring ? "Próxima revisión" : "Entrega"}
          </label>
          <input
            name="deadline"
            type="date"
            className="w-full rounded-xl border border-border bg-white/70 px-3.5 py-2.5 text-[15px] outline-none focus:border-accent"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-1 rounded-full bg-ink py-3 text-[14px] font-semibold text-white transition active:scale-[0.985]"
      >
        Crear proyecto
      </button>
    </form>
  );
}
