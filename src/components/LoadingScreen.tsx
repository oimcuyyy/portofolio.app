import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Lock body scroll during initial loading strictly once on mount
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    const duration = 1700; // 1.7s total progress fill duration
    let animFrameId: number;
    let finishTimer: ReturnType<typeof setTimeout>;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(elapsed / duration, 1);
      // Smooth cubic-bezier curve (starts responsive, eases gently towards 100%)
      const eased = Math.round((1 - Math.pow(1 - raw, 2.6)) * 100);
      setProgress(eased);

      if (raw < 1) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        // Short pause once 100% is reached so the full visual is appreciated
        finishTimer = setTimeout(() => {
          setIsFinished(true);
        }, 150);
      }
    };

    animFrameId = requestAnimationFrame(tick);

    // Allow user to click or press any key to skip immediately
    const handleSkip = (e?: KeyboardEvent | MouseEvent) => {
      if (e && 'key' in e && e.key !== ' ' && e.key !== 'Enter' && e.key !== 'Escape') {
        return;
      }
      cancelAnimationFrame(animFrameId);
      clearTimeout(finishTimer);
      setProgress(100);
      setIsFinished(true);
    };

    window.addEventListener('keydown', handleSkip);

    return () => {
      cancelAnimationFrame(animFrameId);
      clearTimeout(finishTimer);
      window.removeEventListener('keydown', handleSkip);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = '';
        if (onCompleteRef.current) onCompleteRef.current();
      }}
    >
      {!isFinished && (
        <motion.div
          key="cinematic-waterfill-loader"
          initial={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 3.2,
            filter: 'blur(20px)',
            transition: {
              duration: 0.8,
              ease: [0.7, 0, 0.2, 1] as const, // Aggressive forward camera zoom into portfolio
            },
          }}
          onClick={() => setIsFinished(true)}
          className="fixed inset-0 z-[99999] bg-[#030712] text-white flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer px-4 sm:px-6"
        >
          {/* Subtle Neutral Ambient Aura (Zero Green Bleed) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-white/[0.02] blur-[140px] pointer-events-none" />

          {/* Micro Grid Background Pattern */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* MASSIVE TYPOGRAPHY WITH WATER/PERCENTAGE FILL */}
          <div className="relative w-full max-w-7xl flex items-center justify-center">
            
            {/* 1. Base Unfilled Layer (Clean Dark Neutral Silhouette) */}
            <h1
              className="select-none text-center font-black uppercase leading-none tracking-[-0.08em] sm:tracking-[-0.09em] text-[#222734] text-[17vw] sm:text-[14vw] md:text-[12.5vw]"
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              ROCHIM.DEV
            </h1>

            {/* 2. Top Filled Layer (Pure Solid White Fill - Clean Editorial Monolith) */}
            <div
              className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none transition-[height] duration-75 ease-out"
              style={{ height: `${progress}%` }}
            >
              <h1
                className="absolute bottom-0 left-0 w-full select-none text-center font-black uppercase leading-none tracking-[-0.08em] sm:tracking-[-0.09em] text-white text-[17vw] sm:text-[14vw] md:text-[12.5vw]"
                style={{
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                ROCHIM.DEV
              </h1>
            </div>

          </div>

          {/* BOTTOM PERCENTAGE & STATUS - Clean Neutral Monospace */}
          <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            <p className="text-xs sm:text-sm font-mono font-medium uppercase tracking-[0.25em] text-slate-400 whitespace-nowrap">
              LOADING... {progress}%
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
