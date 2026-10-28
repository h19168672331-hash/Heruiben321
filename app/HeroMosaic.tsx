'use client';

import { useEffect, useRef } from 'react';

// Existing portfolio images are the source material; the arrangement changes on each visit.
const sources = [
  '/projects/assets/page-02-01.jpg',
  '/projects/assets/ark3-ritual-night-cover.jpg',
  '/projects/assets/feng-shui-vr-cover.png',
  '/projects/assets/rabbit-linework-display-cover.png',
  '/projects/assets/page-13-01.jpg',
  '/projects/assets/page-22-07.jpg',
];

type Tile = { x: number; y: number; source: number; size: number; alpha: number };

export default function HeroMosaic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    const context = canvas.getContext('2d', { alpha: true });
    if (!host || !context) return;

    const images: HTMLImageElement[] = [];
    let tiles: Tile[] = [];
    let width = 0;
    let height = 0;
    let disposed = false;
    const variation = Math.random() * 1000;

    const rebuild = () => {
      const bounds = host.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Broad, imperfect islands of tiles keep the imagery editorial rather than wallpaper-like.
      const step = width < 760 ? 18 : 24;
      tiles = [];
      for (let y = step * 2; y < height - step; y += step) {
        for (let x = width * (width < 760 ? 0.16 : 0.36); x < width - step; x += step) {
          const nx = x / width;
          const ny = y / height;
          const cloud = Math.pow((nx - .72) / .34, 2) + Math.pow((ny - .44) / .37, 2);
          const lower = Math.pow((nx - .82) / .29, 2) + Math.pow((ny - .76) / .21, 2);
          const grain = Math.sin(x * .031 + y * .044 + variation) * .12;
          if (Math.min(cloud, lower) > 1 + grain || Math.random() < .11) continue;
          tiles.push({
            x, y,
            source: Math.floor((nx * 3 + ny * 2 + variation) % images.length),
            size: step * (.70 + Math.random() * .19),
            alpha: .30 + Math.random() * .30,
          });
        }
      }
      draw();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      if (!width || !height) return;
      context.save();
      for (const tile of tiles) {
        const image = images[tile.source];
        if (!image?.complete || !image.naturalWidth) continue;
        const cropX = (tile.x / width * .72 + .13) * image.naturalWidth;
        const cropY = (tile.y / height * .72 + .13) * image.naturalHeight;
        const cropW = Math.max(2, image.naturalWidth * .024);
        const cropH = Math.max(2, image.naturalHeight * .024);
        context.globalAlpha = tile.alpha;
        context.drawImage(image, cropX, cropY, cropW, cropH, tile.x, tile.y, tile.size, tile.size);
      }
      context.restore();
      context.globalAlpha = 1;
    };

    const resizeObserver = new ResizeObserver(rebuild);
    resizeObserver.observe(host);
    sources.forEach((src) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => { if (!disposed) draw(); };
      image.src = src;
      images.push(image);
    });
    rebuild();

    return () => {
      disposed = true;
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="heroMosaic" aria-hidden="true" />;
}
