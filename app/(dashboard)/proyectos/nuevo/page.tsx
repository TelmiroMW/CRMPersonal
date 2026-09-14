import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createProject } from "@/lib/actions";

export default async function NuevoProyectoPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase.from("clients").select("id, name").order("name");

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <Link
          href="/proyectos"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/70 shadow-[0_1px_2px_rgba(20,20,15,.05)]"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="text-[22px] font-extrabold tracking-tight">Nuevo proyecto</div>
      </div>

      {!clients?.length ? (
        <div className="glass rounded-card p-6 text-center text-sm text-ink-2 shadow-glass">
          Necesitas al menos un cliente antes de crear un proyecto.{" "}
          <Link href="/clientes/nuevo" className="font-semibold text-accent">
            Crea uno primero
          </Link>
          .
        </div>
      ) : (
        <form action={createProject} className="glass flex flex-col gap-4 rounded-card p-5 shadow-glass">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-2">
              Nombre del proyecto
            </label>
            <input
              name="name"
              required
              placeholder="Rediseño web"
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

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-2">
                Ingreso total (€)
              </label>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="12000"
                className="w-full rounded-xl border border-border bg-white/70 px-3.5 py-2.5 text-[15px] outline-none focus:border-accent"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-2">
                Entrega
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
      )}
    </div>
  );
}
