export type Country = {
  code: string;
  name: string;
  /** CSS `background` value that draws a simplified flag using hard gradient stops. */
  flag: string;
};

// A pragmatic set of countries — not the full ISO list, but enough for a
// freelancer's real client base. Add more as needed; unknown codes fall
// back to a neutral gray tile (see flagStyle()).
export const COUNTRIES: Country[] = [
  { code: "ES", name: "España", flag: "linear-gradient(#AA151B 0 25%, #F1BF00 25% 75%, #AA151B 75% 100%)" },
  { code: "DE", name: "Alemania", flag: "linear-gradient(#000 0 33.3%, #DD0000 33.3% 66.6%, #FFCE00 66.6% 100%)" },
  { code: "US", name: "Estados Unidos", flag: "linear-gradient(#3C3B6E 0 55%, #B22234 55% 63%, #fff 63% 71%, #B22234 71% 79%, #fff 79% 87%, #B22234 87% 95%, #fff 95% 100%)" },
  { code: "MX", name: "México", flag: "linear-gradient(90deg, #006847 0 33.3%, #fff 33.3% 66.6%, #CE1126 66.6% 100%)" },
  { code: "PT", name: "Portugal", flag: "linear-gradient(90deg, #006600 0 40%, #FF0000 40% 100%)" },
  { code: "FR", name: "Francia", flag: "linear-gradient(90deg, #0055A4 0 33.3%, #fff 33.3% 66.6%, #EF4135 66.6% 100%)" },
  { code: "IT", name: "Italia", flag: "linear-gradient(90deg, #009246 0 33.3%, #fff 33.3% 66.6%, #CE2B37 66.6% 100%)" },
  { code: "GB", name: "Reino Unido", flag: "linear-gradient(#012169 0 100%)" },
  { code: "NL", name: "Países Bajos", flag: "linear-gradient(#AE1C28 0 33.3%, #fff 33.3% 66.6%, #21468B 66.6% 100%)" },
  { code: "AR", name: "Argentina", flag: "linear-gradient(#74ACDF 0 33.3%, #fff 33.3% 66.6%, #74ACDF 66.6% 100%)" },
  { code: "CO", name: "Colombia", flag: "linear-gradient(#FCD116 0 50%, #003893 50% 75%, #CE1126 75% 100%)" },
  { code: "BR", name: "Brasil", flag: "linear-gradient(#009739 0 100%)" },
];

const FALLBACK_FLAG = "linear-gradient(#d5d5d2, #c2c2be)";

export function flagStyle(code: string | null | undefined): string {
  if (!code) return FALLBACK_FLAG;
  return COUNTRIES.find((c) => c.code === code)?.flag ?? FALLBACK_FLAG;
}

export function countryName(code: string | null | undefined): string {
  if (!code) return "Sin país";
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}
