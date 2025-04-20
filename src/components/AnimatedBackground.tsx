import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createGradient = (x: number, y: number, radius: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(0.2, 'rgba(224, 230, 240, 0.08)');
      gradient.addColorStop(0.4, 'rgba(183, 209, 220, 0.06)');
      gradient.addColorStop(0.6, 'rgba(143, 189, 190, 0.04)');
      gradient.addColorStop(0.8, 'rgba(118, 167, 148, 0.02)');
      gradient.addColorStop(1, 'transparent');
      return gradient;
    };

    const render = () => {
      if (!canvas || !ctx) return;
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create moving gradient points at the edges
      const points = [
        {
          x: 0,
          y: Math.sin(time * 0.001) * canvas.height * 0.3 + canvas.height * 0.5,
          radius: canvas.width * 0.4
        },
        {
          x: canvas.width,
          y: Math.cos(time * 0.001) * canvas.height * 0.3 + canvas.height * 0.5,
          radius: canvas.width * 0.4
        }
      ];

      points.forEach(point => {
        const gradient = createGradient(point.x, point.y, point.radius);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      time += 1;
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ filter: 'blur(100px)' }}
    />
  );
};

export default AnimatedBackground;