import Link from "next/link";
import { createClientRecord } from "@/lib/actions";
import { COUNTRIES } from "@/lib/countries";

export default function NuevoClientePage() {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <Link
          href="/clientes"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/70 shadow-[0_1px_2px_rgba(20,20,15,.05)]"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="text-[22px] font-extrabold tracking-tight">Nuevo cliente</div>
      </div>

      <form action={createClientRecord} className="glass flex flex-col gap-4 rounded-card p-5 shadow-glass">
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-2">
            Nombre
          </label>
          <input
            name="name"
            required
            placeholder="Nombre del cliente o empresa"
            className="w-full rounded-xl border border-border bg-white/70 px-3.5 py-2.5 text-[15px] outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-2">
            País
          </label>
          <select
            name="country_code"
            defaultValue=""
            className="w-full rounded-xl border border-border bg-white/70 px-3.5 py-2.5 text-[15px] outline-none focus:border-accent"
          >
            <option value="">Sin especificar</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="mt-1 rounded-full bg-ink py-3 text-[14px] font-semibold text-white transition active:scale-[0.985]"
        >
          Crear cliente
        </button>
      </form>
    </div>
  );
}
