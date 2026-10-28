import React, { useEffect, useRef } from 'react';
import { X, Play, Pause, Sparkles, Volume2, VolumeX, Music } from 'lucide-react';
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

  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active lyric line
  useEffect(() => {
    if (isLyricsOpen && activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
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

  if (!isLyricsOpen) return null;

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Lirik Lagu Dunia Yang Nanti"
      onClick={(e) => {
        if (e.target === e.currentTarget) toggleLyrics();
      }}
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-amber-950/70 via-slate-950/90 to-black/95 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden text-white">
        
        {/* TOP AMBIENT GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* MODAL HEADER */}
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3.5">
            {/* Spinning mini vinyl */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden vinyl-disc shrink-0 shadow-md">
              <div className={`w-full h-full ${isPlaying ? 'animate-vinyl-spin' : 'animate-vinyl-paused'}`}>
                <img
                  src="/audio/dunia-yang-nanti-cover.webp"
                  alt="Dunia Yang Nanti"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute inset-0 rounded-full vinyl-shine pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-black border border-white/60" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">Dunia yang Nanti</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1">
                  <Sparkles size={10} />
                  Karaoke
                </span>
              </div>
              <p className="text-xs text-amber-200/70">Raim Laode • Sentuh baris lirik untuk lompat lagu</p>
            </div>
          </div>

          <button
            onClick={toggleLyrics}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup Lirik"
          >
            <X size={20} />
          </button>
        </div>

        {/* LYRICS SCROLL AREA */}
        <div
          ref={containerRef}
          className="relative z-10 flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-4 sm:space-y-5 scroll-smooth"
        >
          {DUNIA_YANG_NANTI_LYRICS.map((line, idx) => {
            const isActive = idx === currentLyricIndex;
            const isPast = idx < currentLyricIndex;

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => seek(line.time)}
                className={`group relative p-3 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer select-none ${
                  isActive
                    ? 'bg-amber-500/20 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-[1.02]'
                    : isPast
                    ? 'text-white/45 hover:text-white/80 hover:bg-white/[0.03]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {isActive ? (
                      <span className="mt-1 flex h-2.5 w-2.5 shrink-0 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                      </span>
                    ) : (
                      <span className="mt-1 text-[11px] font-mono text-white/30 group-hover:text-amber-400/70 shrink-0">
                        {formatTime(line.time)}
                      </span>
                    )}

                    <p
                      className={`text-base sm:text-lg font-medium leading-relaxed transition-colors ${
                        isActive
                          ? 'text-amber-200 font-bold drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]'
                          : ''
                      }`}
                    >
                      {line.text}
                    </p>
                  </div>

                  {/* Play cue on hover */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-amber-300 font-mono shrink-0 flex items-center gap-1 self-center bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Play size={10} className="fill-current" />
                    Putar
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL FOOTER CONTROLS */}
        <div className="relative z-10 p-4 sm:p-6 border-t border-white/10 bg-slate-950/80 backdrop-blur-md flex flex-col gap-3">
          
          {/* Progress Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-white/60 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div
              className="relative flex-1 h-2 rounded-full bg-white/10 overflow-hidden cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                seek(pos * duration);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-white/60 w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Bottom Action Row */}
          <div className="flex items-center justify-between">
            {/* Song Mini Info */}
            <div className="flex items-center gap-2 text-xs text-white/70">
              <Music size={14} className="text-amber-400" />
              <span className="truncate max-w-[140px] sm:max-w-none">Raim Laode — Suasana Senja</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Volume Slider */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                  className="text-white/60 hover:text-white transition-colors"
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

              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={togglePlay}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-rose-600 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/25 cursor-pointer"
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
                    <span>Lanjutkan</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
