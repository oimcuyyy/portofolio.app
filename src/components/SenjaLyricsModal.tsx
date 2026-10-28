import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { useSenja } from '../context/SenjaContext';
import { DUNIA_YANG_NANTI_LYRICS } from '../data/lyrics';

export const SenjaLyricsModal: React.FC = () => {
  const {
    isLyricsOpen,
    toggleLyrics,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    currentLyricIndex,
  } = useSenja();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Smooth auto-scroll lyrics to keep active line centered ("berjalan ngikutin lagunya")
  useEffect(() => {
    if (!isLyricsOpen) return;

    if (currentLyricIndex >= 0 && lineRefs.current[currentLyricIndex] && containerRef.current) {
      const activeEl = lineRefs.current[currentLyricIndex];
      const container = containerRef.current;

      const targetTop =
        activeEl!.offsetTop - container.clientHeight / 2 + activeEl!.clientHeight / 2;

      container.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth',
      });
    }
  }, [currentLyricIndex, isLyricsOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLyricsOpen) {
        toggleLyrics();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLyricsOpen, toggleLyrics]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isLyricsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLyricsOpen]);

  if (!isLyricsOpen) return null;

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Lirik Lagu Spotify Style - Dunia Yang Nanti"
      onClick={(e) => {
        if (e.target === e.currentTarget) toggleLyrics();
      }}
    >
      {/* SPOTIFY LYRICS CONTAINER */}
      <div className="relative w-full h-full sm:h-[92vh] max-w-2xl sm:rounded-3xl bg-gradient-to-b from-[#1f0e1a] via-[#120716] to-[#07030a] border-0 sm:border sm:border-amber-500/20 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-white select-none">
        
        {/* Subtle Ambient Dusk Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-44 bg-gradient-to-b from-amber-500/15 via-rose-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* TOP BAR: TRACK INFO & CLOSE */}
        <div className="relative z-20 flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-white/[0.08] bg-black/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Spinning Mini Vinyl */}
            <div className="relative w-11 h-11 rounded-full overflow-hidden vinyl-disc shrink-0 shadow-lg border border-white/20">
              <div className={`w-full h-full ${isPlaying ? 'animate-vinyl-spin' : 'animate-vinyl-paused'}`}>
                <img
                  src="/audio/dunia-yang-nanti-cover.webp"
                  alt="Dunia Yang Nanti"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute inset-0 rounded-full vinyl-shine pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-black border border-white/70" />
            </div>

            <div className="min-w-0">
              <h3 className="font-extrabold text-base sm:text-lg text-white truncate leading-tight">
                Dunia yang Nanti
              </h3>
              <p className="text-xs text-amber-200/80 truncate mt-0.5">
                Raim Laode
              </p>
            </div>
          </div>

          <button
            onClick={toggleLyrics}
            className="p-2.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer shrink-0 active:scale-95"
            aria-label="Tutup Lirik"
            title="Tutup (Esc)"
          >
            <X size={22} />
          </button>
        </div>

        {/* LYRICS STREAM CONTAINER (NO TIMESTAMPS - PURE SPOTIFY AESTHETIC) */}
        <div
          ref={containerRef}
          className="relative z-10 flex-1 overflow-y-auto px-6 sm:px-10 pt-[30vh] pb-[40vh] space-y-6 sm:space-y-8 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {DUNIA_YANG_NANTI_LYRICS.map((line, idx) => {
            const isActive = idx === currentLyricIndex;
            const isPast = idx < currentLyricIndex;

            return (
              <div
                key={idx}
                ref={(el) => {
                  lineRefs.current[idx] = el;
                }}
                onClick={() => seek(line.time)}
                className={`transition-all duration-500 cursor-pointer text-left ${
                  isActive
                    ? 'text-white opacity-100 scale-[1.03] origin-left drop-shadow-[0_4px_24px_rgba(245,158,11,0.35)]'
                    : isPast
                    ? 'text-white/30 hover:text-white/75 hover:opacity-100'
                    : 'text-white/45 hover:text-white/85 hover:opacity-100'
                }`}
              >
                <p
                  className={`font-extrabold tracking-tight transition-all duration-300 select-none ${
                    isActive
                      ? 'text-2xl sm:text-3xl lg:text-4xl text-amber-100'
                      : 'text-xl sm:text-2xl lg:text-3xl'
                  }`}
                >
                  {line.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* BOTTOM STICKY PLAYER CONTROLLER */}
        <div className="relative z-20 px-5 py-4 sm:px-6 sm:py-5 border-t border-white/[0.08] bg-black/60 backdrop-blur-xl shrink-0 flex flex-col gap-3">
          
          {/* Progress Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-white/60 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div
              className="relative flex-1 h-2 rounded-full bg-white/15 overflow-hidden cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                seek(pos * duration);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-100 group-hover:brightness-110"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-white/60 w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            {/* Song Subtitle / Hint */}
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Music size={14} className="text-amber-400 shrink-0" />
              <span className="truncate max-w-[150px] sm:max-w-none">
                Sentuh baris lirik untuk melompat lagu
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Volume Slider */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVolume(volume > 0 ? 0 : 0.85)}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer"
                  aria-label={volume === 0 ? 'Aktifkan Suara' : 'Bisukan Suara'}
                >
                  {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 accent-amber-500 cursor-pointer h-1"
                  aria-label="Volume Musik"
                />
              </div>

              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={togglePlay}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-rose-600 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/30 cursor-pointer"
                aria-label={isPlaying ? 'Jeda Lagu' : 'Putar Lagu'}
              >
                {isPlaying ? (
                  <>
                    <Pause size={14} className="fill-current" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play size={14} className="fill-current ml-0.5" />
                    <span>Putar</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
