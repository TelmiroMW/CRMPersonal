import { NavBar } from "@/components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        // Android/MIUI pinta la franja de la barra de estado en blanco por
        // su cuenta (confirmado, no depende de nuestro CSS). La capa blanca
        // funde esa franja con el resto en los primeros ~220px reales; por
        // debajo, el mismo toque de color atmosférico (lila/rosa) que ya
        // teníamos, para no perder ese detalle.
        background:
          "linear-gradient(180deg, #ffffff 0px, rgba(255,255,255,0) 220px), radial-gradient(115% 30% at 85% -6%, #d9e6fb 0%, rgba(217,230,251,0) 60%), radial-gradient(90% 26% at 8% 4%, #f3dcf5 0%, rgba(243,220,245,0) 55%), #e7e6e2",
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
