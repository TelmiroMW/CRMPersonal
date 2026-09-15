"use client";

// Red de seguridad para cualquier fallo dentro del dashboard (por ejemplo,
// una Server Action que ya no coincide tras un nuevo deploy — el motivo
// más probable de "Application error" al usar la app instalada/PWA justo
// después de publicar cambios). Sin este archivo, Next.js muestra su
// pantalla genérica sin forma de recuperarse salvo cerrar la app del todo.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-lg font-semibold text-neutral-900">Algo ha fallado</p>
      <p className="max-w-xs text-sm text-neutral-500">
        Puede que la app se haya actualizado mientras estaba abierta. Prueba a recargar.
      </p>
      {error.digest && (
        <p className="text-xs text-neutral-400">Código: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white active:opacity-80"
      >
        Reintentar
      </button>
      <button
        onClick={() => window.location.reload()}
        className="text-sm font-medium text-neutral-500 underline underline-offset-2"
      >
        Recargar la app entera
      </button>
    </div>
  );
}
