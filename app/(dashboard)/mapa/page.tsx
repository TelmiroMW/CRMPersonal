import { createClient } from "@/lib/supabase/server";
import { flagStyle, countryName } from "@/lib/countries";

function formatEUR(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default async function MapaPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase.from("clients").select("id, country_code, projects(amount)");

  const byCountry = new Map<string, { total: number; clientCount: number }>();
  let grandTotal = 0;

  for (const c of clients ?? []) {
    const code = c.country_code ?? "??";
    const projectTotal = (c.projects ?? []).reduce((s: number, p: any) => s + Number(p.amount), 0);
    grandTotal += projectTotal;
    const entry = byCountry.get(code) ?? { total: 0, clientCount: 0 };
    entry.total += projectTotal;
    entry.clientCount += 1;
    byCountry.set(code, entry);
  }

  const rows = [...byCountry.entries()]
    .filter(([code]) => code !== "??")
    .sort((a, b) => b[1].total - a[1].total);

  return (
    <div>
      <div className="mb-0.5">
        <div className="text-[32px] font-extrabold tracking-tight">Mapa</div>
        <div className="mt-0.5 text-[13px] text-ink-2">Dónde está tu negocio en el mundo</div>
      </div>

      <div className="flex justify-center py-1.5">
        <svg width="240" height="240" viewBox="0 0 230 230">
          <defs>
            <radialGradient id="sphereShade" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#eef1f5" />
              <stop offset="100%" stopColor="#d3d9e0" />
            </radialGradient>
            <radialGradient id="sphereRim" cx="50%" cy="50%" r="50%">
              <stop offset="82%" stopColor="rgba(20,30,50,0)" />
              <stop offset="100%" stopColor="rgba(20,30,50,.18)" />
            </radialGradient>
          </defs>
          <circle cx="115" cy="115" r="90" fill="url(#sphereShade)" />
          <circle cx="115" cy="115" r="90" fill="url(#sphereRim)" />
          <g style={{ mixBlendMode: "multiply" }}>
            <ellipse cx="115" cy="115" rx="90" ry="34" fill="none" stroke="#c7cedb" strokeWidth="1" />
            <ellipse cx="115" cy="115" rx="90" ry="63" fill="none" stroke="#c7cedb" strokeWidth="1" />
            <ellipse cx="115" cy="115" rx="60" ry="90" fill="none" stroke="#c7cedb" strokeWidth="1" />
            <ellipse cx="115" cy="115" rx="25" ry="90" fill="none" stroke="#c7cedb" strokeWidth="1" />
          </g>
          <circle cx="115" cy="115" r="90" fill="none" stroke="rgba(10,10,10,.12)" strokeWidth="1" />
          <circle cx="82" cy="100" r="5.5" fill="#2f6fed" />
          <circle cx="146" cy="90" r="5.5" fill="#2f6fed" />
          <circle cx="100" cy="136" r="5.5" fill="#2f6fed" />
          <circle cx="156" cy="146" r="5.5" fill="#2f6fed" />
        </svg>
      </div>

      <div className="mb-4 text-center text-xs text-ink-3">
        {rows.length} país{rows.length === 1 ? "" : "es"} con clientes activos
      </div>

      <div className="mb-2.5 flex items-baseline justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-2">Por país</div>
        <div className="tabular-nums text-[13px] font-bold">{formatEUR(grandTotal)} total</div>
      </div>

      <div className="glass overflow-hidden rounded-card shadow-glass">
        {rows.length === 0 && (
          <div className="p-6 text-center text-sm text-ink-2">
            Asigna un país a tus clientes para ver el desglose aquí.
          </div>
        )}
        {rows.map(([code, { total, clientCount }], i) => (
          <div
            key={code}
            className="flex items-center gap-3 p-4"
            style={i > 0 ? { borderTop: "1px solid rgba(10,10,10,.06)" } : undefined}
          >
            <div
              className="h-[15px] w-[22px] flex-shrink-0 rounded-[3px] ring-1 ring-black/[0.08]"
              style={{ background: flagStyle(code) }}
            />
            <div className="flex-1">
              <div className="text-[14.5px] font-semibold">{countryName(code)}</div>
              <div className="text-[11.5px] text-ink-2">
                {clientCount} cliente{clientCount === 1 ? "" : "s"}
              </div>
            </div>
            <div className="tabular-nums text-[14.5px] font-bold">{formatEUR(total)}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-[11px] text-ink-3">
        Versión futura: globo 3D interactivo con países reales coloreados
      </div>
    </div>
  );
}
