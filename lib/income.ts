// Cálculo de ingresos cuando hay proyectos puntuales (precio total) mezclados
// con mensualidades (cuota recurrente entre una fecha de inicio y una fecha
// final, o en curso si no tiene fin). Centralizado aquí para que el
// dashboard, la lista de proyectos y el mapa sumen todos exactamente igual.

export type IncomeSource = {
  billing_type: string | null;
  amount: number | string | null;
  monthly_amount: number | string | null;
  recurring_start: string | null;
  recurring_end: string | null;
};

function endOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31);
}

/** Meses completos de mensualidad que caen dentro de este año, sin contar
 * los que ya han pasado. Si no tiene fecha de fin, se corta a 31 de dic. */
function recurringMonthsThisYear(p: IncomeSource, now: Date = new Date()): number {
  if (!p.recurring_start) return 0;
  const start = new Date(p.recurring_start);
  const yearEnd = endOfYear(now);

  const rangeStart = start > now ? start : now;
  const rangeEnd = p.recurring_end
    ? (() => {
        const end = new Date(p.recurring_end);
        return end < yearEnd ? end : yearEnd;
      })()
    : yearEnd;

  if (rangeEnd < rangeStart) return 0;

  return (
    (rangeEnd.getFullYear() - rangeStart.getFullYear()) * 12 +
    (rangeEnd.getMonth() - rangeStart.getMonth()) +
    1
  );
}

/** Ingreso previsto de un proyecto hasta fin de año: precio total si es
 * puntual, o cuota × meses de mensualidad que quedan este año. */
export function projectedIncome(p: IncomeSource, now: Date = new Date()): number {
  if (p.billing_type === "recurring") {
    return Number(p.monthly_amount ?? 0) * recurringMonthsThisYear(p, now);
  }
  return Number(p.amount ?? 0);
}

export function splitIncome(projects: IncomeSource[]) {
  const now = new Date();
  let oneOff = 0;
  let recurring = 0;
  for (const p of projects) {
    if (p.billing_type === "recurring") {
      recurring += projectedIncome(p, now);
    } else {
      oneOff += Number(p.amount ?? 0);
    }
  }
  return { oneOff, recurring, total: oneOff + recurring };
}
