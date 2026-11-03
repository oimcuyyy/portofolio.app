import { useRef, useEffect } from 'react';
import { useSenja } from '../context/SenjaContext';

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying, activeTheme } = useSenja();
  const themeRef = useRef<{ isPlaying: boolean; activeTheme: string | null }>({
    isPlaying,
    activeTheme,
  });

  useEffect(() => {
    themeRef.current = { isPlaying, activeTheme };
  }, [isPlaying, activeTheme]);

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
      radius: isMobile ? 90 : 130,
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
      senjaColor: string;
      lanyColor: string;
      hindiaColor: string;

      constructor(
        x: number,
        y: number,
        directionX: number,
        directionY: number,
        size: number,
        senjaColor: string,
        lanyColor: string,
        hindiaColor: string
      ) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.senjaColor = senjaColor;
        this.lanyColor = lanyColor;
        this.hindiaColor = hindiaColor;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);

        const { isPlaying, activeTheme } = themeRef.current;
        if (!isPlaying) {
          ctx.fillStyle = '#10b981';
        } else if (activeTheme === 'senja') {
          ctx.fillStyle = this.senjaColor;
        } else if (activeTheme === 'lany') {
          ctx.fillStyle = this.lanyColor;
        } else if (activeTheme === 'hindia') {
          ctx.fillStyle = this.hindiaColor;
        } else {
          ctx.fillStyle = '#10b981';
        }

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
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

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
      const lanyPalette = ['#38bdf8', '#818cf8', '#c084fc', '#60a5fa', '#a78bfa'];
      const hindiaPalette = ['#f43f5e', '#fb7185', '#fda4af', '#f8fafc', '#cbd5e1'];

      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (canvas.width - size * 4) + size * 2;
        const y = Math.random() * (canvas.height - size * 4) + size * 2;
        const directionX = Math.random() * 1.5 - 0.75;
        const directionY = Math.random() * 1.5 - 0.75;

        particlesArray.push(
          new Particle(
            x,
            y,
            directionX,
            directionY,
            size,
            senjaPalette[i % senjaPalette.length],
            lanyPalette[i % lanyPalette.length],
            hindiaPalette[i % hindiaPalette.length]
          )
        );
      }
    }

    function connect() {
      if (!ctx) return;
      const len = particlesArray.length;
      ctx.lineWidth = 0.8;
      const { isPlaying, activeTheme } = themeRef.current;

      for (let a = 0; a < len; a++) {
        const pA = particlesArray[a];
        for (let b = a + 1; b < len; b++) {
          const pB = particlesArray[b];
          const dx = pA.x - pB.x;
          const dy = pA.y - pB.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 10000) {
            const opacity = (1 - distSq / 10000) * (isPlaying ? 0.45 : 0.35);

            if (!isPlaying) {
              ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
            } else if (activeTheme === 'senja') {
              ctx.strokeStyle = `rgba(251, 146, 60, ${opacity})`;
            } else if (activeTheme === 'lany') {
              ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
            } else if (activeTheme === 'hindia') {
              ctx.strokeStyle = `rgba(244, 63, 94, ${opacity})`;
            } else {
              ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
            }

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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
    />
  );
}
