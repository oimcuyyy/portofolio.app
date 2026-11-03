import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Pause, Volume2, VolumeX, Music, SkipBack, SkipForward, Sparkles } from 'lucide-react';
import { useSenja } from '../context/SenjaContext';

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
    currentSong,
    currentSongIndex,
    songs,
    selectSong,
    nextSong,
    prevSong,
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
  }, [currentLyricIndex, isLyricsOpen, currentSongIndex]);

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

  // Dynamic theme accent styling
  const isLany = currentSong.themeId === 'lany';
  const isHindia = currentSong.themeId === 'hindia';

  const modalBackdropClass = isLany
    ? 'from-[#0a1128] via-[#050b1a] to-[#02050e]'
    : isHindia
    ? 'from-[#18181b] via-[#09090b] to-[#000000]'
    : 'from-[#1f0e1a] via-[#120716] to-[#07030a]';

  const glowGradient = isLany
    ? 'from-sky-500/20 via-indigo-500/15 to-transparent'
    : isHindia
    ? 'from-white/15 via-zinc-400/10 to-transparent'
    : 'from-amber-500/20 via-rose-500/15 to-transparent';

  const activeTextColor = isLany
    ? 'text-sky-100 drop-shadow-[0_4px_24px_rgba(56,189,248,0.45)]'
    : isHindia
    ? 'text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.6)]'
    : 'text-amber-100 drop-shadow-[0_4px_24px_rgba(245,158,11,0.45)]';

  const progressBarGradient = isLany
    ? 'from-sky-400 via-indigo-400 to-purple-400'
    : isHindia
    ? 'from-white via-zinc-200 to-zinc-400'
    : 'from-amber-400 via-orange-400 to-rose-500';

  const playBtnGradient = isLany
    ? 'from-sky-500 to-indigo-600 shadow-sky-500/30'
    : isHindia
    ? 'from-white to-zinc-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
    : 'from-amber-500 to-rose-600 shadow-amber-500/30';

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Lirik Lagu Spotify Style - ${currentSong.title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) toggleLyrics();
      }}
    >
      {/* SPOTIFY LYRICS CONTAINER */}
      <div
        className={`relative w-full h-full sm:h-[92vh] max-w-2xl sm:rounded-3xl bg-gradient-to-b ${modalBackdropClass} border-0 sm:border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-white select-none transition-colors duration-700`}
      >
        {/* Subtle Ambient Dusk Glow */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-44 bg-gradient-to-b ${glowGradient} blur-3xl pointer-events-none transition-all duration-700`}
        />

        {/* TOP BAR: TRACK INFO & TRACK SELECTOR & CLOSE */}
        <div className="relative z-20 flex flex-col gap-3 px-5 py-3.5 sm:px-6 sm:py-4 border-b border-white/[0.08] bg-black/40 backdrop-blur-md shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Spinning Mini Vinyl */}
              <div className="relative w-11 h-11 rounded-full overflow-hidden vinyl-disc shrink-0 shadow-lg border border-white/20">
                <div
                  className={`w-full h-full ${
                    isPlaying ? 'animate-vinyl-spin' : 'animate-vinyl-paused'
                  }`}
                >
                  <img
                    src={currentSong.coverSrc}
                    alt={currentSong.title}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute inset-0 rounded-full vinyl-shine pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-black border border-white/70" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-white truncate leading-tight">
                    {currentSong.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/90 font-semibold border border-white/15 flex items-center gap-1 shrink-0">
                    <Sparkles size={10} />
                    {isPlaying ? currentSong.themeBadge : `Track 0${currentSongIndex + 1}`}
                  </span>
                </div>
                <p className="text-xs text-white/70 truncate mt-0.5">
                  {currentSong.artist}
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

          {/* Quick Track Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {songs.map((song, idx) => (
              <button
                key={song.id}
                onClick={() => selectSong(idx)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer border ${
                  idx === currentSongIndex
                    ? 'bg-white text-slate-950 border-white shadow-sm font-bold scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/15 text-white/70 border-white/10'
                }`}
              >
                {song.title} • {song.artist}
              </button>
            ))}
          </div>
        </div>

        {/* LYRICS STREAM CONTAINER (NO TIMESTAMPS - PURE SPOTIFY AESTHETIC) */}
        <div
          ref={containerRef}
          className="relative z-10 flex-1 overflow-y-auto px-6 sm:px-10 pt-[25vh] pb-[40vh] space-y-6 sm:space-y-8 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {currentSong.lyrics.map((line, idx) => {
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
                    ? 'text-white opacity-100 scale-[1.03] origin-left'
                    : isPast
                    ? 'text-white/30 hover:text-white/75 hover:opacity-100'
                    : 'text-white/45 hover:text-white/85 hover:opacity-100'
                }`}
              >
                <p
                  className={`font-extrabold tracking-tight transition-all duration-300 select-none ${
                    isActive
                      ? `text-2xl sm:text-3xl lg:text-4xl ${activeTextColor}`
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
                className={`h-full bg-gradient-to-r ${progressBarGradient} rounded-full transition-all duration-100 group-hover:brightness-110`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-white/60 w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Song Subtitle / Hint */}
            <div className="flex items-center gap-2 text-xs text-white/60 min-w-0">
              <Music size={14} className="text-amber-400 shrink-0" />
              <span className="truncate">
                Sentuh baris lirik untuk lompat lagu
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
              {/* Skip Prev Button */}
              <button
                type="button"
                onClick={prevSong}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer active:scale-95"
                aria-label="Lagu Sebelumnya"
                title="Lagu Sebelumnya"
              >
                <SkipBack size={18} />
              </button>

              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={togglePlay}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${playBtnGradient} hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer`}
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

              {/* Skip Next Button */}
              <button
                type="button"
                onClick={nextSong}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer active:scale-95"
                aria-label="Lagu Berikutnya"
                title="Lagu Berikutnya"
              >
                <SkipForward size={18} />
              </button>

              {/* Volume Slider */}
              <div className="hidden sm:flex items-center gap-2 ml-2">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
