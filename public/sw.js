// Service worker mínimo. Su única función real hoy es cumplir el
// requisito de Chrome para considerar la app "instalable" (necesita
// un SW registrado con un handler de fetch). Deja pasar todo tal cual;
// cuando queramos soporte offline de verdad, aquí es donde se añade.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
