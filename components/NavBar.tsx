"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "Resumen",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 11L12 4L20 11V20H14V14H10V20H4V11Z"
          stroke={active ? "#ffffff" : "rgba(255,255,255,.5)"}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/proyectos",
    label: "Proyectos",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="4" rx="1.4" stroke={active ? "#ffffff" : "rgba(255,255,255,.5)"} strokeWidth="1.8" />
        <rect x="4" y="15" width="16" height="4" rx="1.4" stroke={active ? "#ffffff" : "rgba(255,255,255,.5)"} strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: "/clientes",
    label: "Clientes",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.4" stroke={active ? "#ffffff" : "rgba(255,255,255,.5)"} strokeWidth="1.8" />
        <path
          d="M5 20C5 16.5 8 14.5 12 14.5C16 14.5 19 16.5 19 20"
          stroke={active ? "#ffffff" : "rgba(255,255,255,.5)"}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/mapa",
    label: "Mapa",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke={active ? "#ffffff" : "rgba(255,255,255,.5)"} strokeWidth="1.8" />
        <ellipse cx="12" cy="12" rx="3.6" ry="8.5" stroke={active ? "#ffffff" : "rgba(255,255,255,.5)"} strokeWidth="1.8" />
        <path d="M3.5 12H20.5" stroke={active ? "#ffffff" : "rgba(255,255,255,.5)"} strokeWidth="1.8" />
      </svg>
    ),
  },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="tabbar-glass fixed bottom-[22px] left-[30px] right-[30px] z-40 mx-auto flex h-[58px] max-w-[330px] items-center justify-around rounded-[29px] px-1.5 shadow-floating">
      {TABS.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-label={tab.label}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
              active ? "bg-white/[0.18]" : ""
            }`}
          >
            {tab.icon(active)}
          </Link>
        );
      })}
    </nav>
  );
}
