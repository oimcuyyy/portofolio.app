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
    const duration = 1100; // Snappy intro duration balancing brand signature & fast LCP
    let animFrameId: number;
    let finishTimer: ReturnType<typeof setTimeout>;
    let lastProgress = -1;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(elapsed / duration, 1);
      // Smooth cubic-bezier curve (starts energetic, smoothly lands at 100%)
      const eased = Math.round((1 - Math.pow(1 - raw, 2.6)) * 100);

      // Only trigger React state update if integer percentage changed (prevents lag on 120Hz/144Hz displays)
      if (eased !== lastProgress) {
        lastProgress = eased;
        setProgress(eased);
      }

      if (raw < 1) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        // Short 160ms pause at 100% so the fully filled text is appreciated before forward zoom
        finishTimer = setTimeout(() => {
          setIsFinished(true);
        }, 160);
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
            filter: 'blur(16px)',
            transition: {
              duration: 0.75,
              ease: [0.7, 0, 0.2, 1] as const, // Cinematic forward camera zoom into portfolio
            },
          }}
          onClick={() => setIsFinished(true)}
          className="fixed inset-0 z-[99999] bg-[#030712] text-white flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer px-4 sm:px-6 transform-gpu will-change-transform will-change-opacity"
        >
          {/* Subtle Ambient Aura (Hardware-accelerated) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-white/[0.015] blur-[120px] pointer-events-none transform-gpu" />

          {/* Micro Grid Background Pattern */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* WATERFILL TYPOGRAPHY (GPU-Accelerated Dual Layer clip-path - uses div/aria-hidden so page keeps strictly one semantic H1) */}
          <div aria-hidden="true" className="relative inline-block select-none text-center px-4">
            {/* 1. Base Layer (Dark Silhouette: #222734 for ROCHIM, #132a22 for .DEV) */}
            <div
              className="select-none text-center font-black uppercase leading-none tracking-[-0.08em] sm:tracking-[-0.09em] whitespace-nowrap text-[#222734]"
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: 'clamp(2.5rem, 9.2vw, 8rem)',
              }}
            >
              ROCHIM<span className="text-[#132a22]">.DEV</span>
            </div>

            {/* 2. Top Filled Layer (Pure White #ffffff + Vibrant Emerald #34d399, vertically clipped with GPU clip-path inset) */}
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
              style={{
                clipPath: `inset(${100 - progress}% 0 0 0)`,
                WebkitClipPath: `inset(${100 - progress}% 0 0 0)`,
              }}
            >
              <div
                className="select-none text-center font-black uppercase leading-none tracking-[-0.08em] sm:tracking-[-0.09em] whitespace-nowrap text-white"
                style={{
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: 'clamp(2.5rem, 9.2vw, 8rem)',
                }}
              >
                ROCHIM<span className="text-emerald-400">.DEV</span>
              </div>
            </div>
          </div>

          {/* BOTTOM PERCENTAGE & STATUS */}
          <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            <p className="text-xs sm:text-sm font-mono font-medium uppercase tracking-[0.25em] text-slate-400 whitespace-nowrap">
              LOADING... {progress}%
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
