import { NavBar } from "@/components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        // La barra de estado (arriba) y la de gestos (abajo) de la app
        // nativa (TWA) son un color FIJO grabado en el APK — no pueden
        // seguir el degradado. Por eso los bordes funden aquí al mismo
        // #e7e6e2 que usa esa barra nativa Y la pantalla de login: un
        // único color de borde en toda la app para que nunca desentone,
        // sea cual sea la pantalla. El toque de color queda solo en el
        // interior, lejos de los bordes.
        // backgroundAttachment:fixed ancla el degradado al viewport real
        // (no a la altura del contenido), así el fundido de abajo queda
        // siempre pegado al borde de la pantalla aunque haya scroll.
        background:
          "linear-gradient(180deg, #e7e6e2 0px, rgba(231,230,226,0) 220px), linear-gradient(0deg, #e7e6e2 0px, rgba(231,230,226,0) 90px), radial-gradient(115% 30% at 85% -6%, #d9e6fb 0%, rgba(217,230,251,0) 60%), radial-gradient(90% 26% at 8% 4%, #f3dcf5 0%, rgba(243,220,245,0) 55%), #e7e6e2",
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
