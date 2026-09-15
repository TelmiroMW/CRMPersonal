"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

type Marker = { location: [number, number]; size: number };

const SIZE = 240; // tamaño mostrado en pantalla (CSS), en px

// Globo 3D de verdad (WebGL vía cobe) — sustituye al mockup plano de antes.
// Gira solo despacio y se puede arrastrar con el dedo/ratón, con inercia al
// soltar. Los colores siguen la paleta de la app: base clara a juego con el
// fondo, marcadores en el azul de acento.
export function Globe({ markers }: { markers: Marker[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const pointerDown = useRef(false);
  const pointerStartX = useRef(0);
  const phiAtPointerDown = useRef(0);
  const dragMomentum = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // El búfer de dibujo (canvas.width/height, en píxeles reales) tiene que
    // ser el tamaño mostrado × devicePixelRatio, y ese MISMO número hay que
    // pasárselo también a cobe en `width`/`height` — si no coinciden entre
    // sí, cobe dibuja mal encajado y solo se aprecian los marcadores.
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const bufferSize = Math.round(SIZE * dpr);
    canvas.width = bufferSize;
    canvas.height = bufferSize;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: bufferSize,
      height: bufferSize,
      phi: 0,
      theta: 0.32,
      dark: 0,
      diffuse: 1.25,
      mapSamples: 18000,
      mapBrightness: 3.4,
      // Tiene que contrastar con el fondo de la página (#e7e6e2) o la
      // esfera se camufla y solo se ven los marcadores flotando — por eso
      // casi blanco, bastante más claro que el fondo, no el mismo tono.
      baseColor: [0.98, 0.98, 0.97],
      markerColor: [0.184, 0.435, 0.929],
      glowColor: [0.6, 0.73, 0.98],
      markers,
      // cobe 2.0.1 soporta onRender en runtime (documentado en su propio
      // README) pero el .d.ts publicado en el paquete no lo declara.
      // @ts-expect-error — ver comentario de arriba.
      onRender: (state) => {
        if (!pointerDown.current) {
          phiRef.current += 0.0028 + dragMomentum.current;
          dragMomentum.current *= 0.92;
        }
        state.phi = phiRef.current;
      },
    });

    return () => globe.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(markers)]);

  return (
    <div
      style={{ width: SIZE, height: SIZE, cursor: "grab" }}
      className="relative touch-none"
      onPointerDown={(e) => {
        pointerDown.current = true;
        pointerStartX.current = e.clientX;
        phiAtPointerDown.current = phiRef.current;
        (e.target as HTMLElement).style.cursor = "grabbing";
      }}
      onPointerUp={(e) => {
        pointerDown.current = false;
        (e.target as HTMLElement).style.cursor = "grab";
      }}
      onPointerOut={(e) => {
        pointerDown.current = false;
        (e.target as HTMLElement).style.cursor = "grab";
      }}
      onPointerMove={(e) => {
        if (!pointerDown.current) return;
        const delta = e.clientX - pointerStartX.current;
        phiRef.current = phiAtPointerDown.current + delta * 0.006;
        dragMomentum.current = delta * 0.00004;
      }}
    >
      <canvas ref={canvasRef} style={{ width: SIZE, height: SIZE, contain: "layout paint size" }} />
    </div>
  );
}
