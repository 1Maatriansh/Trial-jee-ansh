import React, { useEffect, useRef } from 'react';

/**
 * Ansh JEE — Background System
 * Layered, subtle, theme-aware:
 * 1. Base --bg
 * 2. Blueprint grid (1px lines with faint ticks)
 * 3. Fine grain (SVG noise)
 * 4. Soft vignette
 * 5. Desktop pointer-following light (disabled under reduced motion)
 */
export function Background() {
  const lightRef = useRef(null);

  useEffect(() => {
    // Only enable pointer-following light on fine pointer desktop devices
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!mediaQuery.matches || motionQuery.matches) return;

    let rafId = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const handlePointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${currentX - 250}px, ${currentY - 250}px, 0)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="bg-system"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-bg)',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* 1. Blueprint Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, var(--grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* 2. Pointer following radial light (Desktop) */}
      <div
        ref={lightRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--grid) 0%, transparent 70%)',
          opacity: 0.8,
          willChange: 'transform',
        }}
      />

      {/* 3. Soft vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, var(--bg) 95%)',
          opacity: 0.7,
        }}
      />

      {/* 4. Fine grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--grain-opacity)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px',
        }}
      />
    </div>
  );
}
