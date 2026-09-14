import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Deja pasar sin autenticación los recursos públicos de la PWA
    // (manifest, iconos, service worker) — Android los pide sin sesión
    // al verificar si la app es instalable / generar el WebAPK.
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon|apple-icon|icons|.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
