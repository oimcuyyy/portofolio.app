import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only enable custom cursor for devices that support fine hover
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('a') ||
        target?.closest('button') ||
        target?.closest('[role="button"]') ||
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999] hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.6 : 1,
          opacity: 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`rounded-full transition-colors duration-200 ${
          isHovered
            ? 'w-9 h-9 border border-emerald-400/80 bg-emerald-500/15 backdrop-blur-[1px]'
            : 'w-4 h-4 border border-emerald-400/60 bg-emerald-400/20'
        } flex items-center justify-center`}
      >
        <span
          className={`rounded-full bg-emerald-400 transition-all duration-200 ${
            isHovered ? 'w-1.5 h-1.5 opacity-80' : 'w-1 h-1 opacity-100'
          }`}
        />
      </motion.div>
    </motion.div>
  );
}

export function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative rounded-[2rem] border border-white/[0.08] dark:border-white/[0.08] bg-white/[0.03] dark:bg-[#080d1a]/60 backdrop-blur-xl transition-all duration-500 hover:border-emerald-500/30 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Cursor Spotlight Gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              480px circle at ${mouseX}px ${mouseY}px,
              rgba(16, 185, 129, 0.14),
              transparent 70%
            )
          `,
        }}
      />
      {/* Top subtle highlight reflection */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 dark:via-white/20 to-transparent z-10" />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}

export function MagneticButton({
  children,
  className = '',
  href,
  download,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  download?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.a>
  );
}
