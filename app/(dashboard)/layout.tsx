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
        // sea cual sea la pantalla. Las dos primeras capas (edge fades)
        // son las que garantizan eso — NO tocar su color ni su alcance
        // (220px arriba / 90px abajo) sin volver a comprobar en el móvil.
        // El resto del degradado vive POR DEBAJO de esas dos capas, así
        // que puede ser todo lo vistoso que se quiera sin arriesgar el
        // borde: tres manchas suaves (azul, malva, menta) dan sensación
        // de "aurora" en vez de limitarse a una esquina.
        // backgroundAttachment:fixed ancla el degradado al viewport real
        // (no a la altura del contenido), así el fundido de abajo queda
        // siempre pegado al borde de la pantalla aunque haya scroll.
        background:
          "linear-gradient(180deg, #e7e6e2 0px, rgba(231,230,226,0) 220px), linear-gradient(0deg, #e7e6e2 0px, rgba(231,230,226,0) 90px), radial-gradient(130% 60% at 90% -4%, #b9d3fb 0%, rgba(185,211,251,0) 70%), radial-gradient(115% 55% at 2% 12%, #edb9e2 0%, rgba(237,185,226,0) 68%), radial-gradient(120% 55% at 50% 108%, #b3e6c6 0%, rgba(179,230,198,0) 68%), #e7e6e2",
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
