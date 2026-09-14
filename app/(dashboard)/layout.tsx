import { NavBar } from "@/components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        // TEMPORAL: color imposible de confundir para diagnosticar si la
        // franja de arriba es nuestro CSS o el propio Android/MIUI.
        background: "red",
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
