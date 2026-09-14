import { NavBar } from "@/components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Fondo anclado al viewport visual (no a la altura del documento) —
          en iOS standalone, 100vh no siempre cubre el hueco detrás de la
          barra de estado, así que fixed+inset-0 lo garantiza. */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(115% 26% at 85% -6%, #d9e6fb 0%, rgba(217,230,251,0) 60%), radial-gradient(90% 22% at 8% 4%, #f3dcf5 0%, rgba(243,220,245,0) 55%), #e7e6e2",
        }}
      />
      <div className="mx-auto max-w-[520px] px-5 pb-32 pt-14">{children}</div>
      <NavBar />
    </div>
  );
}
