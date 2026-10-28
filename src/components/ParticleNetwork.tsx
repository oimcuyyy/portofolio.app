import { useRef, useEffect } from 'react';
import { useSenja } from '../context/SenjaContext';

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isSenjaMode } = useSenja();
  const isSenjaRef = useRef(isSenjaMode);

  useEffect(() => {
    isSenjaRef.current = isSenjaMode;
  }, [isSenjaMode]);

  useEffect(() => {
    // Respect reduced-motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    const isMobile = window.innerWidth < 768;
    const maxParticles = isMobile ? 28 : 55;

    let mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: isMobile ? 90 : 130
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (!canvas) return;

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Mouse interaction (repel particles)
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius + this.size) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * 5;
            const directionY = forceDirectionY * force * 5;

            this.x -= directionX;
            this.y -= directionY;
          }
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      if (!canvas) return;
      particlesArray = [];
      let numberOfParticles = (canvas.height * canvas.width) / 12000;
      if (numberOfParticles > maxParticles) numberOfParticles = maxParticles;

      const senjaPalette = ['#fbbf24', '#f97316', '#f43f5e', '#fb7185', '#e879f9'];

      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1.5) - 0.75;
        let directionY = (Math.random() * 1.5) - 0.75;
        let color = isSenjaRef.current 
          ? senjaPalette[i % senjaPalette.length]
          : '#10b981';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    function connect() {
      if (!ctx) return;
      const len = particlesArray.length;
      ctx.lineWidth = 0.8;
      const isSenja = isSenjaRef.current;

      for (let a = 0; a < len; a++) {
        const pA = particlesArray[a];
        for (let b = a + 1; b < len; b++) {
          const pB = particlesArray[b];
          const dx = pA.x - pB.x;
          const dy = pA.y - pB.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 10000) {
            const opacity = (1 - (distSq / 10000)) * (isSenja ? 0.45 : 0.35);
            ctx.strokeStyle = isSenja 
              ? `rgba(251, 146, 60, ${opacity})`
              : `rgba(16, 185, 129, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.stroke();
          }
        }
      }
    }

    let animationId: number;
    let isPaused = false;

    function animate() {
      if (!isPaused) {
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
          }
          connect();
        }
      }
      animationId = requestAnimationFrame(animate);
    }

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    handleResize(); // sets width, height, and calls init()
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isSenjaMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
    />
  );
}
