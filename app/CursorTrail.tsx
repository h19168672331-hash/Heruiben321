'use client';

import { useEffect, useRef } from 'react';

type TrailMark = {
  x: number;
  y: number;
  size: number;
  life: number;
  rotation: number;
  shape: 'circle' | 'square' | 'ring';
  color: string;
};

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const marks: TrailMark[] = [];
    const palette = ['#d9ff43', '#2749ff', '#ff3b24'];
    let previousX = -100;
    let previousY = -100;
    let frame = 0;
    let markIndex = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let index = marks.length - 1; index >= 0; index -= 1) {
        const mark = marks[index];
        mark.life -= 0.055;
        mark.size *= 0.985;

        if (mark.life <= 0) {
          marks.splice(index, 1);
          continue;
        }

        context.save();
        context.translate(mark.x, mark.y);
        context.rotate(mark.rotation);
        context.globalAlpha = Math.max(0, mark.life) * 0.82;
        context.fillStyle = mark.color;
        context.strokeStyle = mark.color;
        context.lineWidth = 1.5;

        if (mark.shape === 'circle') {
          context.beginPath();
          context.arc(0, 0, mark.size, 0, Math.PI * 2);
          context.fill();
        } else if (mark.shape === 'ring') {
          context.beginPath();
          context.arc(0, 0, mark.size * 1.35, 0, Math.PI * 2);
          context.stroke();
        } else {
          context.fillRect(-mark.size, -mark.size, mark.size * 2, mark.size * 2);
        }

        context.restore();
      }

      frame = marks.length ? window.requestAnimationFrame(draw) : 0;
    };

    const addMark = (x: number, y: number) => {
      const shapes: TrailMark['shape'][] = ['circle', 'square', 'ring'];
      marks.push({
        x,
        y,
        size: 3.5 + (markIndex % 3) * 1.4,
        life: 1,
        rotation: (markIndex % 8) * 0.18,
        shape: shapes[markIndex % shapes.length],
        color: palette[markIndex % palette.length],
      });
      markIndex += 1;
      if (marks.length > 30) marks.shift();
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const distance = Math.hypot(event.clientX - previousX, event.clientY - previousY);
      if (distance < 7) return;

      if (previousX > -50) {
        const steps = Math.min(4, Math.max(1, Math.floor(distance / 14)));
        for (let step = 1; step <= steps; step += 1) {
          const progress = step / steps;
          addMark(
            previousX + (event.clientX - previousX) * progress,
            previousY + (event.clientY - previousY) * progress,
          );
        }
      } else {
        addMark(event.clientX, event.clientY);
      }

      previousX = event.clientX;
      previousY = event.clientY;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursorTrailCanvas" aria-hidden="true" />;
}
