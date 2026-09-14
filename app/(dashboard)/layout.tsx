import { NavBar } from "@/components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        // Android/MIUI pinta tanto la barra de estado (arriba) como la
        // barra de gestos (abajo) en blanco por su cuenta, confirmado que
        // no depende de nuestro CSS. Fundimos nuestro fondo a blanco en
        // ambos bordes para que la transición parezca buscada; el resto
        // conserva el toque de color atmosférico de siempre.
        // backgroundAttachment:fixed ancla el degradado al viewport real
        // (no a la altura del contenido), así el fundido de abajo queda
        // siempre pegado al borde de la pantalla aunque haya scroll.
        background:
          "linear-gradient(180deg, #ffffff 0px, rgba(255,255,255,0) 220px), linear-gradient(0deg, #ffffff 0px, rgba(255,255,255,0) 90px), radial-gradient(115% 30% at 85% -6%, #d9e6fb 0%, rgba(217,230,251,0) 60%), radial-gradient(90% 26% at 8% 4%, #f3dcf5 0%, rgba(243,220,245,0) 55%), #e7e6e2",
        backgroundAttachment: "fixed",
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
