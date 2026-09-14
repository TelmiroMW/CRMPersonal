"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "install-prompt-dismissed";

type Platform = "ios" | "android" | "other";

export function InstallPrompt() {
  const [platform, setPlatform] = useState<Platform>("other");
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      // Private browsing / storage blocked — treat as not dismissed.
    }

    if (isStandalone || dismissed) return;

    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);

    if (isIOS) {
      setPlatform("ios");
      setVisible(true);
      return;
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform("android");
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    dismiss();
  }

  if (!visible) return null;

  return (
    <div className="glass mb-4 flex items-center gap-3 rounded-2xl p-3.5 shadow-glass">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-ink">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="min-w-0 flex-1 text-[12.5px] text-ink-2">
        {platform === "ios" ? (
          <>
            Instala la app: toca{" "}
            <svg width="12" height="14" viewBox="0 0 24 24" fill="none" className="inline -translate-y-px" aria-hidden>
              <path d="M12 2V15M12 2L8 6M12 2L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 10H5C3.9 10 3 10.9 3 12V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V12C21 10.9 20.1 10 19 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>{" "}
            <strong className="font-semibold text-ink">Compartir</strong> y luego{" "}
            <strong className="font-semibold text-ink">&quot;Añadir a pantalla de inicio&quot;</strong>.
          </>
        ) : (
          <>
            Instala la app en tu pantalla de inicio para acceder más rápido.
          </>
        )}
      </div>

      {platform === "android" && (
        <button
          onClick={handleInstall}
          className="flex-shrink-0 rounded-full bg-ink px-3.5 py-2 text-[12.5px] font-semibold text-white"
        >
          Instalar
        </button>
      )}

      <button
        onClick={dismiss}
        aria-label="Cerrar"
        className="flex-shrink-0 text-ink-3"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
