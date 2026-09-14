import { NavBar } from "@/components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        // Android/MIUI pinta la franja de la barra de estado en blanco por
        // su cuenta, sin que podamos cambiarla vía web (confirmado). En vez
        // de pelear con eso, arrancamos el degradado en ese mismo blanco y
        // lo fundimos hacia el gris de la app — así la transición parece
        // buscada en vez de un corte entre dos zonas.
        background: "linear-gradient(180deg, #ffffff 0px, #e7e6e2 220px)",
      }}
    >
      <div
        className="mx-auto max-w-[520px] px-5 pb-32"
        style={{ paddingTop: "max(24px, env(safe-area-inset-top))" }}
      >
        {children}
      </div>
      <NavBar />
    </div>
  );
}
