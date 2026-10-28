'use client';

import { useEffect, useRef } from 'react';

// Existing project artwork becomes a continuously changing particle image.
const sources = [
  '/projects/assets/page-02-01.jpg',
  '/projects/assets/ark3-ritual-night-cover.jpg',
  '/projects/assets/feng-shui-vr-cover.png',
  '/projects/assets/rabbit-linework-display-cover.png',
  '/projects/assets/page-13-01.jpg',
  '/projects/assets/page-22-07.jpg',
];

const FRAME_INTERVAL = 1000 / 30;
const IMAGE_INTERVAL = 6500;
const TRANSITION_TIME = 1800;

type Particle = {
  x: number;
  y: number;
  column: number;
  row: number;
  phase: number;
  size: number;
  alpha: number;
};
type Sample = { image: HTMLImageElement; shades: Uint8Array | null };

export default function HeroMosaic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !host || !context) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const samples: Sample[] = sources
      .map((src) => ({ src, random: Math.random() }))
      .sort((a, b) => a.random - b.random)
      .map(({ src }) => {
        const image = new Image();
        image.decoding = 'async';
        image.src = src;
        return { image, shades: null };
      });
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let lastFrame = 0;
    let clock = 0;
    let lastTick = 0;
    let visible = true;
    let disposed = false;

    const shadeAt = (sample: Sample, column: number, row: number) =>
      sample.shades?.[row * columns + column] ?? 150;

    const draw = () => {
      context.clearRect(0, 0, width, height);
      if (!width || !height || !particles.length) return;
      const ready = samples.filter((sample) => sample.shades);
      if (!ready.length) return;

      const position = motionQuery.matches ? 0 : clock / IMAGE_INTERVAL;
      const activeIndex = Math.floor(position) % ready.length;
      const nextIndex = (activeIndex + 1) % ready.length;
      const intervalProgress = position % 1;
      const blendStart = 1 - TRANSITION_TIME / IMAGE_INTERVAL;
      const blend = Math.max(0, Math.min(1, (intervalProgress - blendStart) / (1 - blendStart)));
      const easedBlend = blend * blend * (3 - 2 * blend);
      const scatter = Math.sin(Math.PI * easedBlend) * 16;

      for (const particle of particles) {
        const first = shadeAt(ready[activeIndex], particle.column, particle.row);
        const second = shadeAt(ready[nextIndex], particle.column, particle.row);
        const shade = Math.round(first + (second - first) * easedBlend);
        const motionX = motionQuery.matches ? 0 : Math.sin(clock * .00072 + particle.phase) * 6;
        const motionY = motionQuery.matches ? 0 : Math.cos(clock * .00059 + particle.phase * 1.3) * 8;
        const driftX = Math.cos(particle.phase * 3.1) * scatter;
        const driftY = Math.sin(particle.phase * 2.7) * scatter;
        context.fillStyle = `rgba(${shade},${shade},${shade},${particle.alpha})`;
        context.fillRect(
          particle.x + motionX + driftX,
          particle.y + motionY + driftY,
          particle.size,
          particle.size,
        );
      }
    };

    const animate = (now: number) => {
      if (disposed || !visible || motionQuery.matches) return;
      if (!lastTick) lastTick = now;
      clock += Math.min(now - lastTick, 80);
      lastTick = now;
      if (now - lastFrame >= FRAME_INTERVAL) {
        draw();
        lastFrame = now;
      }
      frame = requestAnimationFrame(animate);
    };

    const updatePlayback = () => {
      cancelAnimationFrame(frame);
      lastTick = 0;
      if (motionQuery.matches || !visible || document.hidden) draw();
      else frame = requestAnimationFrame(animate);
    };

    const sampleImage = (sample: Sample) => {
      if (!columns || !rows || !sample.image.naturalWidth) return;
      const paletteCanvas = document.createElement('canvas');
      paletteCanvas.width = columns;
      paletteCanvas.height = rows;
      const paletteContext = paletteCanvas.getContext('2d', { willReadFrequently: true });
      if (!paletteContext) return;
      const image = sample.image;
      const targetRatio = columns / rows;
      const imageRatio = image.naturalWidth / image.naturalHeight;
      const sourceWidth = imageRatio > targetRatio ? image.naturalHeight * targetRatio : image.naturalWidth;
      const sourceHeight = imageRatio > targetRatio ? image.naturalHeight : image.naturalWidth / targetRatio;
      paletteContext.drawImage(
        image,
        (image.naturalWidth - sourceWidth) / 2,
        (image.naturalHeight - sourceHeight) / 2,
        sourceWidth,
        sourceHeight,
        0,
        0,
        columns,
        rows,
      );
      const pixels = paletteContext.getImageData(0, 0, columns, rows).data;
      const shades = new Uint8Array(columns * rows);
      for (let i = 0; i < shades.length; i++) {
        const offset = i * 4;
        const luminance = pixels[offset] * .2126 + pixels[offset + 1] * .7152 + pixels[offset + 2] * .0722;
        shades[i] = Math.max(28, Math.min(205, Math.round(luminance * .72 + 22)));
      }
      sample.shades = shades;
      draw();
    };

    const rebuild = () => {
      const bounds = host.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const step = width < 760 ? 18 : 26;
      const startX = width * (width < 760 ? .30 : .40);
      const startY = step * 2;
      columns = Math.ceil((width - startX) / step);
      rows = Math.ceil((height - startY) / step);
      particles = [];
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const x = startX + column * step;
          const y = startY + row * step;
          const nx = x / width;
          const ny = y / height;
          const upper = ((nx - .72) / .34) ** 2 + ((ny - .43) / .39) ** 2;
          const lower = ((nx - .81) / .29) ** 2 + ((ny - .77) / .22) ** 2;
          const edgeNoise = Math.sin(column * 1.7 + row * 2.3) * .1;
          if (Math.min(upper, lower) > 1 + edgeNoise || Math.random() < .075) continue;
          particles.push({
            x,
            y,
            column,
            row,
            phase: Math.random() * Math.PI * 2,
            size: step * (.72 + Math.random() * .15),
            alpha: .46 + Math.random() * .23,
          });
        }
      }
      samples.forEach((sample) => { sample.shades = null; sampleImage(sample); });
      draw();
    };

    samples.forEach((sample) => {
      sample.image.onload = () => { if (!disposed) sampleImage(sample); };
    });
    const resizeObserver = new ResizeObserver(rebuild);
    resizeObserver.observe(host);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    intersectionObserver.observe(host);
    motionQuery.addEventListener('change', updatePlayback);
    document.addEventListener('visibilitychange', updatePlayback);
    rebuild();
    updatePlayback();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener('change', updatePlayback);
      document.removeEventListener('visibilitychange', updatePlayback);
      samples.forEach((sample) => { sample.image.onload = null; });
    };
  }, []);

  return <canvas ref={canvasRef} className="heroMosaic" aria-hidden="true" />;
}
