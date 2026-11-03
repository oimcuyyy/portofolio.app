import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Sparkles, Terminal } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [statusText, setStatusText] = useState('Booting creative architecture...');

  useEffect(() => {
    // Lock body scroll during initial loading
    document.body.style.overflow = 'hidden';

    // Status steps tied to progress percentages
    const statusSteps = [
      { threshold: 0, text: 'Booting creative architecture...' },
      { threshold: 25, text: 'Compiling React 19 & TypeScript...' },
      { threshold: 55, text: 'Tuning multi-theme audio engine...' },
      { threshold: 85, text: 'Calibrating haptic UI experience...' },
      { threshold: 100, text: 'System ready. Welcome to rochim.dev' },
    ];

    const startTime = performance.now();
    const duration = 1800; // 1.8 seconds smooth cinematic load

    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(1, elapsed / duration);

      // Ease-out cubic curve for natural acceleration and deceleration
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
      const currentPercent = Math.round(easedProgress * 100);

      setProgress(currentPercent);

      // Update status text based on percentage
      for (let i = statusSteps.length - 1; i >= 0; i--) {
        if (currentPercent >= statusSteps[i].threshold) {
          setStatusText(statusSteps[i].text);
          break;
        }
      }

      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setStatusText('System ready. Welcome to rochim.dev');
        // Small satisfying hold at 100% before cinematic reveal
        setTimeout(() => {
          setIsFinished(true);
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }, 320);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    // Allow user to click or press any key to skip immediately
    const handleSkip = (e?: KeyboardEvent | MouseEvent) => {
      if (e && 'key' in e && e.key !== ' ' && e.key !== 'Enter' && e.key !== 'Escape') {
        return;
      }
      cancelAnimationFrame(animationFrameId);
      setProgress(100);
      setIsFinished(true);
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    };

    window.addEventListener('keydown', handleSkip);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleSkip);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -30,
            filter: 'blur(12px)',
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] bg-[#030712] text-slate-100 flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden"
        >
          {/* Ambient center emerald glow orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[580px] h-[380px] sm:h-[580px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
          <div className="absolute top-1/4 left-1/3 w-[260px] h-[260px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />

          {/* Micro Grid Background Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* TOP BAR */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex items-center justify-between"
          >
            {/* Identity Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400">
                rochim.dev
              </span>
              <span className="text-[10px] font-mono text-slate-500">/ portfolio</span>
            </div>

            {/* Location & Status Pill */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
              <Terminal size={13} className="text-emerald-500" />
              <span>JAKARTA, ID • 2026</span>
            </div>
          </motion.div>

          {/* CENTER DISPLAY: LOGO + PERCENTAGE + PROGRESS BAR */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8">
            
            {/* Animated Code Monogram Badge */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-white/[0.06] to-teal-500/20 border border-emerald-500/30 p-0.5 shadow-[0_0_50px_rgba(16,185,129,0.25)] flex items-center justify-center">
                <Code2 size={32} className="text-emerald-400" />
              </div>

              {/* Decorative Corner Sparkle */}
              <div className="absolute -top-1 -right-1 text-emerald-400">
                <Sparkles size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </motion.div>

            {/* Big Monospace Percent Counter */}
            <div className="relative flex items-baseline justify-center">
              <span className="text-7xl sm:text-8xl md:text-9xl font-extrabold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tabular-nums">
                {progress}
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 ml-1">
                %
              </span>
            </div>

            {/* High-end 2px Hairline Progress Bar */}
            <div className="w-64 sm:w-80 h-1.5 bg-white/10 rounded-full overflow-hidden mt-6 relative shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full relative shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              >
                {/* Glowing Lead Light */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              </motion.div>
            </div>

            {/* Dynamic Status Text */}
            <motion.p
              key={statusText}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs sm:text-sm font-mono text-slate-400 mt-4 text-center max-w-sm truncate px-2"
            >
              {statusText}
            </motion.p>

            {/* Skip Hint */}
            <span className="text-[10px] font-mono text-slate-600 mt-3 hover:text-slate-400 transition-colors cursor-pointer">
              Sentuh atau tekan spasi untuk langsung masuk
            </span>
          </div>

          {/* BOTTOM BAR */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/[0.06] pt-4 text-[11px] font-mono text-slate-500"
          >
            <div>
              <span>MUHAMMAD ROCHIMULOH</span>
              <span className="mx-2 text-slate-700">•</span>
              <span className="text-slate-400">SOFTWARE ENGINEERING</span>
            </div>

            <div className="flex items-center gap-3">
              <span>SMKN 20 JAKARTA</span>
              <span className="text-slate-700">•</span>
              <span className="text-emerald-500/80">STACK: REACT 19 & TS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;

