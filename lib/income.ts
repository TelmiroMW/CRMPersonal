// Cálculo de ingresos cuando hay proyectos puntuales (precio total) mezclados
// con mensualidades (retribución recurrente todos los meses). Centralizado
// aquí para que el dashboard, la lista de proyectos y el mapa sumen todos
// exactamente igual.

export type IncomeSource = {
  billing_type: string | null;
  amount: number | string | null;
  monthly_amount: number | string | null;
};

/** Meses que quedan hasta cerrar el año, contando el actual (sep. → 4: sep-oct-nov-dic). */
export function remainingMonthsInYear(date: Date = new Date()): number {
  return 12 - date.getMonth();
}

/** Ingreso previsto de un proyecto hasta fin de año: precio total si es
 * puntual, o cuota × meses restantes si es una mensualidad. */
export function projectedIncome(p: IncomeSource, months: number = remainingMonthsInYear()): number {
  if (p.billing_type === "recurring") {
    return Number(p.monthly_amount ?? 0) * months;
  }
  return Number(p.amount ?? 0);
}

export function splitIncome(projects: IncomeSource[]) {
  const months = remainingMonthsInYear();
  let oneOff = 0;
  let recurring = 0;
  for (const p of projects) {
    if (p.billing_type === "recurring") {
      recurring += Number(p.monthly_amount ?? 0) * months;
    } else {
      oneOff += Number(p.amount ?? 0);
    }
  }
  return { oneOff, recurring, total: oneOff + recurring };
}
