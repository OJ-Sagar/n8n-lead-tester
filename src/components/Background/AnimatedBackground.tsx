import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX = -1000;
    let mouseY = -1000;
    let frameId = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const particles: Particle[] = Array.from(
      { length: Math.min(70, Math.floor(window.innerWidth / 18)) },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.3 + 0.1,
      }),
    );

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        const dxMouse = particle.x - mouseX;
        const dyMouse = particle.y - mouseY;
        const mouseDistance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (mouseDistance > 0 && mouseDistance < 120) {
          const force = ((120 - mouseDistance) / 120) * 0.8;
          particle.x += (dxMouse / mouseDistance) * force;
          particle.y += (dyMouse / mouseDistance) * force;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(249,115,22,${particle.a})`;
        context.fill();

        for (let linkIndex = index + 1; linkIndex < particles.length; linkIndex += 1) {
          const neighbor = particles[linkIndex];
          const dx = particle.x - neighbor.x;
          const dy = particle.y - neighbor.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 140) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(neighbor.x, neighbor.y);
            context.strokeStyle = `rgba(249,115,22,${0.12 * (1 - distance / 140)})`;
            context.lineWidth = 0.6;
            context.stroke();
          }
        }
      });

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <canvas id="bgCanvas" ref={canvasRef} aria-hidden="true" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="noise" />
    </>
  );
}
