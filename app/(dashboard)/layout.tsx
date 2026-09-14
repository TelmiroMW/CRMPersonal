import { NavBar } from "@/components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[520px] px-5 pb-32 pt-14">{children}</div>
      <NavBar />
    </div>
  );
}
