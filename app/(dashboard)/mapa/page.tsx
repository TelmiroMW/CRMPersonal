import { createClient } from "@/lib/supabase/server";
import { flagStyle, countryName, COUNTRIES } from "@/lib/countries";
import { projectedIncome } from "@/lib/income";
import { Globe } from "@/components/Globe";

function formatEUR(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default async function MapaPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, country_code, projects(amount, monthly_amount, billing_type, archived_at)");

  const byCountry = new Map<string, { total: number; clientCount: number }>();
  let grandTotal = 0;

  for (const c of clients ?? []) {
    const code = c.country_code ?? "??";
    const projectTotal = (c.projects ?? [])
      .filter((p: any) => !p.archived_at)
      .reduce((s: number, p: any) => s + projectedIncome(p), 0);
    grandTotal += projectTotal;
    const entry = byCountry.get(code) ?? { total: 0, clientCount: 0 };
    entry.total += projectTotal;
    entry.clientCount += 1;
    byCountry.set(code, entry);
  }

  const rows = [...byCountry.entries()]
    .filter(([code]) => code !== "??")
    .sort((a, b) => b[1].total - a[1].total);

  const maxTotal = Math.max(1, ...rows.map(([, r]) => r.total));
  const markers = rows
    .map(([code, r]) => {
      const country = COUNTRIES.find((c) => c.code === code);
      if (!country?.coords) return null;
      return { location: country.coords, size: 0.05 + 0.1 * (r.total / maxTotal) };
    })
    .filter((m): m is { location: [number, number]; size: number } => m !== null);

  return (
    <div>
      <div className="mb-0.5">
        <div className="text-[32px] font-extrabold tracking-tight">Mapa</div>
        <div className="mt-0.5 text-[13px] text-ink-2">Dónde está tu negocio en el mundo</div>
      </div>

      <div className="flex justify-center py-1.5">
        <Globe markers={markers} />
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

    </div>
  );
}
