import React, { useEffect, useRef } from "react";

// Matrix-style digital rain as a subtle background layer.
// 2D canvas for performance; respects dpr.
export default function MatrixRain({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const chars =
      "01¬§°•¿••••••ABCDEF0123456789<>[]{}#$%&*!?:;/";
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops = [];
    const fontSize = 14;

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.floor(width / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.floor((Math.random() * height) / fontSize)
      );
    };
    resize();
    window.addEventListener("resize", resize);

    let frame;
    let last = 0;
    const interval = 70; // ms per frame — controls speed

    const draw = (now) => {
      frame = requestAnimationFrame(draw);
      if (now - last < interval) return;
      last = now;

      // Trail fade
      ctx.fillStyle = "rgba(5, 7, 14, 0.18)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // Leading character bright
        ctx.fillStyle = "rgba(34, 211, 238, 0.85)";
        ctx.fillText(text, x, y);
        // Trail character dimmer
        ctx.fillStyle = "rgba(34, 211, 238, 0.15)";
        ctx.fillText(text, x, y - fontSize);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ opacity: 0.35 }}
    />
  );
}
