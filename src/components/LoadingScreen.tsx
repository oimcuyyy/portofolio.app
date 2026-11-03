import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [isFinished, setIsFinished] = useState(false);
  const [lineLoaded, setLineLoaded] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Lock body scroll during initial loading strictly once on mount
    document.body.style.overflow = 'hidden';

    // Trigger progress line animation
    const lineTimer = setTimeout(() => {
      setLineLoaded(true);
    }, 100);

    // Finish loading and trigger exit transition
    const exitTimer = setTimeout(() => {
      setIsFinished(true);
      document.body.style.overflow = '';
      if (onCompleteRef.current) onCompleteRef.current();
    }, 1850); // 1.85s duration: buttery smooth, not rushed, not tedious

    // Allow user to click or press any key to skip immediately
    const handleSkip = (e?: KeyboardEvent | MouseEvent) => {
      if (e && 'key' in e && e.key !== ' ' && e.key !== 'Enter' && e.key !== 'Escape') {
        return;
      }
      clearTimeout(lineTimer);
      clearTimeout(exitTimer);
      setIsFinished(true);
      document.body.style.overflow = '';
      if (onCompleteRef.current) onCompleteRef.current();
    };

    window.addEventListener('keydown', handleSkip);

    return () => {
      clearTimeout(lineTimer);
      clearTimeout(exitTimer);
      window.removeEventListener('keydown', handleSkip);
      document.body.style.overflow = '';
    };
  }, []);

  // Letters of rochim.dev for staggered kinetic entrance
  const brandName = "rochim.dev";
  const letters = Array.from(brandName);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.045,
        delayChildren: 0.12,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 32,
      filter: 'blur(8px)',
      scale: 0.92,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(16px)',
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
          }}
          onClick={() => {
            setIsFinished(true);
            document.body.style.overflow = '';
            if (onCompleteRef.current) onCompleteRef.current();
          }}
          className="fixed inset-0 z-[99999] bg-[#030712] text-white flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer"
        >
          {/* Ambient center emerald glow orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] rounded-full bg-emerald-500/12 blur-[130px] pointer-events-none" />

          {/* Micro Grid Background Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* MAIN HERO CENTERPIECE: rochim.dev */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Staggered Animated Letters of rochim.dev */}
            <motion.h1
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl sm:text-7xl md:text-8xl font-extrabold font-mono tracking-tight flex items-center"
            >
              {letters.map((char, index) => {
                const isDevPart = index >= 6; // ".dev" starts at index 6
                return (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className={`inline-block transition-colors duration-300 ${
                      isDevPart
                        ? 'text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.55)]'
                        : 'text-white drop-shadow-[0_4px_16px_rgba(255,255,255,0.15)]'
                    }`}
                  >
                    {char}
                  </motion.span>
                );
              })}

              {/* Pulsating emerald terminal dot */}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75, duration: 0.3 }}
                className="inline-block w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-400 ml-2.5 shadow-[0_0_12px_#34d399] animate-pulse"
              />
            </motion.h1>

            {/* Glowing Hairline Progress Line under rochim.dev */}
            <div className="w-full max-w-[220px] sm:max-w-[320px] h-[2px] bg-white/10 rounded-full mt-6 overflow-hidden relative shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.9)]"
                initial={{ width: '0%' }}
                animate={{ width: lineLoaded ? '100%' : '0%' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
              />
            </div>

            {/* Subtle Minimalist Tagline */}
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="text-[11px] font-mono tracking-widest text-slate-500 uppercase mt-4"
            >
              [ portfolio • 2026 ]
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
