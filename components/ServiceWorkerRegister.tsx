"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // No pasa nada si falla — la app funciona igual sin él,
        // solo no se ofrecerá el aviso de instalación en Chrome.
      });
    }
  }, []);

  return null;
}
