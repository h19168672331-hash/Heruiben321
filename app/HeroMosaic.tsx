'use client';

import { useEffect, useRef } from 'react';

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
const IMAGE_TRANSITION = 1800;
const WORD_INTERVAL = 12000;
const WORD_ENTER = 1500;
const WORD_ARRIVE = 3900;
const WORD_LEAVE = 6800;
const WORD_SCATTERED = 9100;

type Point = { x: number; y: number };
type Particle = {
  homeX: number;
  homeY: number;
  wordX: number;
  wordY: number;
  phase: number;
  size: number;
  wordSize: number;
  alpha: number;
  wordShade: number;
};
type Sample = { image: HTMLImageElement; shades: Uint8Array | null };
type TitleRect = { x: number; y: number; right: number; bottom: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const ease = (value: number) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

export default function HeroMosaic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !host || !context) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const samples: Sample[] = sources
      .map((src) => ({ src, order: Math.random() }))
      .sort((a, b) => a.order - b.order)
      .map(({ src }) => {
        const image = new Image();
        image.decoding = 'async';
        image.src = src;
        return { image, shades: null };
      });
    let width = 0;
    let height = 0;
    let paletteWidth = 0;
    let paletteHeight = 0;
    let particles: Particle[] = [];
    let wordTargets: Point[] = [];
    let wordCount = 0;
    let titleRects: TitleRect[] = [];
    let frame = 0;
    let lastFrame = 0;
    let clock = 0;
    let lastTick = 0;
    let cycle = -1;
    let refreshedHomes = false;
    let visible = true;
    let disposed = false;

    const randomHome = (occupied: Point[]): Point => {
      const mobile = width < 760;
      const minDistance = mobile ? 12 : 21;
      let candidate = { x: width * .75, y: height * .5 };
      for (let attempt = 0; attempt < 90; attempt++) {
        const x = width * (mobile ? .19 : .42) + Math.random() * width * (mobile ? .81 : .58);
        const y = height * (.07 + Math.random() * .95);
        candidate = { x, y };
        const nx = x / width;
        const ny = y / height;
        const upper = ((nx - .72) / .38) ** 2 + ((ny - .42) / .43) ** 2;
        const lower = ((nx - .82) / .33) ** 2 + ((ny - .82) / .27) ** 2;
        if (Math.min(upper, lower) > 1.08) continue;
        if (occupied.some((point) => Math.hypot(point.x - x, point.y - y) < minDistance)) continue;
        return candidate;
      }
      return candidate;
    };

    const makeWordTargets = (): Point[] => {
      const mask = document.createElement('canvas');
      mask.width = Math.ceil(width);
      mask.height = Math.ceil(height);
      const maskContext = mask.getContext('2d', { willReadFrequently: true });
      if (!maskContext) return [];
      const mobile = width < 760;
      const letterSize = mobile ? width * .19 : Math.min(width * .112, height * .225);
      const digitSize = letterSize * (mobile ? .78 : .84);
      const letterY = height * (mobile ? .23 : .54);
      const digitY = height * (mobile ? .34 : .755);
      const letterCenters = mobile ? [.43, .63, .83] : [.66, .79, .92];
      const digitCenters = mobile ? [.53, .73] : [.725, .855];
      maskContext.fillStyle = '#fff';
      maskContext.textAlign = 'center';
      maskContext.textBaseline = 'alphabetic';
      maskContext.font = `900 ${letterSize}px Arial, Helvetica, sans-serif`;
      ['B', 'E', 'N'].forEach((letter, index) => {
        maskContext.fillText(letter, width * letterCenters[index], letterY);
      });
      maskContext.font = `900 ${digitSize}px Arial, Helvetica, sans-serif`;
      digitCenters.forEach((center) => maskContext.fillText('9', width * center, digitY));

      const data = maskContext.getImageData(0, 0, mask.width, mask.height).data;
      const step = mobile ? 8 : 13;
      const targets: Point[] = [];
      for (let y = Math.floor(height * (mobile ? .08 : .24)); y < height * .82; y += step) {
        for (let x = Math.floor(width * (mobile ? .29 : .53)); x < width * .97; x += step) {
          const jitterX = (Math.random() - .5) * step * .7;
          const jitterY = (Math.random() - .5) * step * .7;
          const px = clamp(Math.round(x + jitterX), 0, mask.width - 1);
          const py = clamp(Math.round(y + jitterY), 0, mask.height - 1);
          if (data[(py * mask.width + px) * 4 + 3] > 128 && Math.random() > .09) {
            targets.push({ x: px, y: py });
          }
        }
      }
      return targets;
    };

    const measureTitle = () => {
      const bounds = host.getBoundingClientRect();
      titleRects = Array.from(host.querySelectorAll('h1 span')).flatMap((span) => {
        const range = document.createRange();
        range.selectNodeContents(span);
        return Array.from(range.getClientRects()).map((rect) => ({
          x: rect.left - bounds.left,
          y: rect.top - bounds.top,
          right: rect.right - bounds.left,
          bottom: rect.bottom - bounds.top,
        }));
      });
    };

    const titleFade = (x: number, y: number) => {
      let fade = 0;
      for (const rect of titleRects) {
        const dx = Math.max(rect.x - x, 0, x - rect.right);
        const dy = Math.max(rect.y - y, 0, y - rect.bottom);
        fade = Math.max(fade, 1 - Math.hypot(dx, dy) / 42);
      }
      return clamp(fade, 0, 1);
    };

    const shadeAt = (sample: Sample, x: number, y: number) => {
      const column = clamp(Math.floor(x / width * paletteWidth), 0, paletteWidth - 1);
      const row = clamp(Math.floor(y / height * paletteHeight), 0, paletteHeight - 1);
      return sample.shades?.[row * paletteWidth + column] ?? 155;
    };

    const assignWordTargets = () => {
      const shuffled = [...wordTargets];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      for (let i = 0; i < wordCount; i++) {
        particles[i].wordX = shuffled[i].x;
        particles[i].wordY = shuffled[i].y;
      }
    };

    const refreshWordHomes = () => {
      const occupied: Point[] = particles.slice(wordCount).map((particle) => ({
        x: particle.homeX,
        y: particle.homeY,
      }));
      for (let i = 0; i < wordCount; i++) {
        const point = randomHome(occupied);
        particles[i].homeX = point.x;
        particles[i].homeY = point.y;
        occupied.push(point);
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      if (!width || !height || !particles.length) return;

      const reduced = motionQuery.matches;
      const phase = reduced ? 0 : clock % WORD_INTERVAL;
      const nextCycle = reduced ? 0 : Math.floor(clock / WORD_INTERVAL);
      if (nextCycle !== cycle) {
        cycle = nextCycle;
        refreshedHomes = false;
        assignWordTargets();
      }
      const wordMix = phase < WORD_ENTER ? 0
        : phase < WORD_ARRIVE ? ease((phase - WORD_ENTER) / (WORD_ARRIVE - WORD_ENTER))
        : phase < WORD_LEAVE ? 1
        : phase < WORD_SCATTERED ? 1 - ease((phase - WORD_LEAVE) / (WORD_SCATTERED - WORD_LEAVE))
        : 0;
      if (!reduced && phase >= WORD_LEAVE && !refreshedHomes) {
        refreshWordHomes();
        refreshedHomes = true;
      }

      const ready = samples.filter((sample) => sample.shades);
      const imagePosition = reduced ? 0 : clock / IMAGE_INTERVAL;
      const firstImage = ready.length ? ready[Math.floor(imagePosition) % ready.length] : null;
      const secondImage = ready.length ? ready[(Math.floor(imagePosition) + 1) % ready.length] : null;
      const imageProgress = imagePosition % 1;
      const blendStart = 1 - IMAGE_TRANSITION / IMAGE_INTERVAL;
      const imageBlend = ease((imageProgress - blendStart) / (1 - blendStart));

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const mix = i < wordCount ? wordMix : 0;
        const driftX = reduced ? 0 : Math.sin(clock * .00072 + particle.phase) * (width < 760 ? 3 : 7);
        const driftY = reduced ? 0 : Math.cos(clock * .00059 + particle.phase * 1.3) * (width < 760 ? 4 : 8);
        const gather = Math.sin(Math.PI * mix) * (width < 760 ? 5 : 12);
        const x = (particle.homeX + driftX) * (1 - mix)
          + (particle.wordX + Math.sin(clock * .0012 + particle.phase) * 1.5) * mix
          + Math.cos(particle.phase * 2.4) * gather;
        const y = (particle.homeY + driftY) * (1 - mix)
          + (particle.wordY + Math.cos(clock * .001 + particle.phase) * 1.5) * mix
          + Math.sin(particle.phase * 2.1) * gather;
        const firstShade = firstImage ? shadeAt(firstImage, particle.homeX, particle.homeY) : 155;
        const secondShade = secondImage ? shadeAt(secondImage, particle.homeX, particle.homeY) : firstShade;
        const imageShade = firstShade + (secondShade - firstShade) * imageBlend;
        const shade = Math.round(imageShade + (particle.wordShade - imageShade) * mix);
        const alpha = (particle.alpha + ((.72 + particle.alpha * .2) - particle.alpha) * mix)
          * (1 - .82 * titleFade(x, y));
        const size = particle.size + (particle.wordSize - particle.size) * mix;
        context.fillStyle = `rgba(${shade},${shade},${shade},${alpha.toFixed(3)})`;
        context.fillRect(x, y, size, size);
      }
    };

    const animate = (now: number) => {
      if (disposed || !visible || motionQuery.matches || document.hidden) return;
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
      if (!paletteWidth || !paletteHeight || !sample.image.naturalWidth) return;
      const palette = document.createElement('canvas');
      palette.width = paletteWidth;
      palette.height = paletteHeight;
      const paletteContext = palette.getContext('2d', { willReadFrequently: true });
      if (!paletteContext) return;
      const image = sample.image;
      const targetRatio = paletteWidth / paletteHeight;
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
        paletteWidth,
        paletteHeight,
      );
      const pixels = paletteContext.getImageData(0, 0, paletteWidth, paletteHeight).data;
      const shades = new Uint8Array(paletteWidth * paletteHeight);
      for (let i = 0; i < shades.length; i++) {
        const offset = i * 4;
        const luminance = pixels[offset] * .2126 + pixels[offset + 1] * .7152 + pixels[offset + 2] * .0722;
        shades[i] = clamp(Math.round(luminance * .72 + 22), 28, 205);
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

      paletteWidth = Math.max(24, Math.ceil(width / 18));
      paletteHeight = Math.max(24, Math.ceil(height / 18));
      const count = width < 760 ? 160 : 290;
      const occupied: Point[] = [];
      particles = [];
      for (let i = 0; i < count; i++) {
        const point = randomHome(occupied);
        occupied.push(point);
        const mobile = width < 760;
        particles.push({
          homeX: point.x,
          homeY: point.y,
          wordX: point.x,
          wordY: point.y,
          phase: Math.random() * Math.PI * 2,
          size: (mobile ? 6 : 9) + Math.random() * (mobile ? 9 : 17),
          wordSize: (mobile ? 5 : 7) + Math.random() * (mobile ? 6 : 12),
          alpha: .27 + Math.random() * .24,
          wordShade: 45 + Math.round(Math.random() * 63),
        });
      }
      wordTargets = makeWordTargets();
      wordCount = Math.min(wordTargets.length, Math.floor(particles.length * .76));
      measureTitle();
      cycle = -1;
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
    document.fonts.ready.then(() => { if (!disposed) rebuild(); });
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
