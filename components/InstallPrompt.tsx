"use client";

import { useEffect, useState } from "react";

type Platform = "ios" | "android" | "other";

export function InstallPrompt() {
  const [platform, setPlatform] = useState<Platform>("other");
  const [installed, setInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setPlatform(/iphone|ipad|ipod/.test(ua) ? "ios" : /android/.test(ua) ? "android" : "other");

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    function onInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  async function handleClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome !== "dismissed") setDeferredPrompt(null);
      return;
    }
    // El navegador no nos ha dado el diálogo nativo todavía (o no existe,
    // como en iOS) — no hay forma de forzarlo, así que explicamos el gesto.
    setShowHelp(true);
  }

  return (
    <div className="glass mb-4 rounded-2xl p-3.5 shadow-glass">
      <button onClick={handleClick} className="flex w-full items-center gap-3 text-left">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-ink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-semibold">Instalar en el móvil</div>
          <div className="text-[11.5px] text-ink-2">Añádela a tu pantalla de inicio</div>
        </div>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M9 6L15 12L9 18" stroke="#9a9a9e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {showHelp && (
        <div className="mt-3 rounded-xl bg-black/[0.035] p-3 text-[12.5px] leading-relaxed text-ink-2">
          {platform === "ios" ? (
            <>
              Toca{" "}
              <svg width="12" height="14" viewBox="0 0 24 24" fill="none" className="inline -translate-y-px" aria-hidden>
                <path d="M12 2V15M12 2L8 6M12 2L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 10H5C3.9 10 3 10.9 3 12V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V12C21 10.9 20.1 10 19 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>{" "}
              <strong className="font-semibold text-ink">Compartir</strong> en la barra de Safari, y luego{" "}
              <strong className="font-semibold text-ink">&quot;Añadir a pantalla de inicio&quot;</strong>.
            </>
          ) : (
            <>
              Tu navegador aún no ofrece la instalación directa aquí. Abre el menú{" "}
              <strong className="font-semibold text-ink">⋮</strong> arriba a la derecha y toca{" "}
              <strong className="font-semibold text-ink">&quot;Añadir a pantalla de inicio&quot;</strong> o{" "}
              <strong className="font-semibold text-ink">&quot;Instalar app&quot;</strong>.
            </>
          )}
        </div>
      )}
    </div>
  );
}
