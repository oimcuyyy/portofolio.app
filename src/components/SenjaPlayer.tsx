import React from 'react';
import { Play, Pause, Mic2, Sparkles } from 'lucide-react';
import { useSenja } from '../context/SenjaContext';
import { SenjaLyricsModal } from './SenjaLyricsModal';

const SenjaPlayer: React.FC = () => {
  const {
    isPlaying,
    isSenjaMode,
    togglePlay,
    currentLyricText,
    toggleLyrics,
    currentTime,
    duration,
  } = useSenja();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div className="w-full mt-6 max-w-xl" data-aos="fade-up" data-aos-delay="100">
        <div
          className={`group relative overflow-hidden rounded-2xl p-3 sm:p-4 border transition-all duration-700 backdrop-blur-xl ${
            isSenjaMode
              ? 'bg-gradient-to-r from-amber-950/45 via-orange-950/35 to-rose-950/45 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.25)]'
              : 'bg-white/70 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 hover:border-amber-500/30 shadow-md'
          }`}
        >
          {/* Ambient Warm Sunset Glow behind widget */}
          <div
            className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 blur-xl pointer-events-none transition-opacity duration-700 ${
              isSenjaMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
            }`}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            
            {/* LEFT: Spotify-style Vinyl Record with Artwork + Song Info */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              
              {/* ROTATING SPOTIFY-STYLE VINYL RECORD */}
              <div
                onClick={togglePlay}
                className="relative shrink-0 cursor-pointer group/vinyl"
                title={isPlaying ? 'Jeda Lagu' : 'Putar Lagu (0 Delay)'}
              >
                {/* Vinyl Outer Disc */}
                <div
                  className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full vinyl-disc p-1 border flex items-center justify-center transition-all duration-700 shadow-lg ${
                    isPlaying
                      ? 'border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                      : 'border-white/15 group-hover/vinyl:border-amber-400/40'
                  }`}
                >
                  {/* Concentric Grooves Texture */}
                  <div className="absolute inset-0 rounded-full vinyl-grooves pointer-events-none" />

                  {/* Spinning Disc Core with Artwork */}
                  <div
                    className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center ${
                      isPlaying ? 'animate-vinyl-spin' : 'animate-vinyl-paused'
                    }`}
                  >
                    {/* Album Art Image (Raim Laode - Dunia yang Nanti) */}
                    <img
                      src="/audio/dunia-yang-nanti-cover.webp"
                      alt="Dunia yang Nanti - Raim Laode"
                      className="w-full h-full object-cover rounded-full"
                      loading="eager"
                    />

                    {/* Glossy Vinyl Sheen Overlay */}
                    <div className="absolute inset-0 rounded-full vinyl-shine pointer-events-none" />

                    {/* Center Vinyl Spindle Hole */}
                    <div className="absolute w-3 h-3 rounded-full bg-black/90 border border-slate-300 shadow-inner flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-slate-400" />
                    </div>
                  </div>

                  {/* Vinyl Gloss Highlight */}
                  <div className="absolute inset-0 rounded-full vinyl-shine pointer-events-none" />
                </div>

                {/* Live Playing Pulse Indicator on Vinyl */}
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-slate-950" />
                  </span>
                )}
              </div>

              {/* TRACK TITLE, ARTIST & DYNAMIC LYRIC PREVIEW */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    Dunia yang Nanti
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/25 shrink-0 flex items-center gap-1">
                    <Sparkles size={10} />
                    {isSenjaMode ? 'Mode Senja Aktif' : 'Raim Laode'}
                  </span>
                </div>

                {/* Subtitle / Live Lyric Line */}
                <p
                  className={`text-xs truncate mt-0.5 transition-all duration-300 ${
                    isPlaying
                      ? 'text-amber-700 dark:text-amber-300 font-medium animate-fade-in'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                  title={currentLyricText}
                >
                  {currentLyricText}
                </p>

                {/* Mini Song Scrubber on Play */}
                {isPlaying && (
                  <div className="w-full max-w-[200px] h-1 rounded-full bg-slate-200 dark:bg-white/10 mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-150"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Equalizer Bars, Lirik Button & Play/Pause */}
            <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
              
              {/* Equalizer Bars */}
              <div className="hidden sm:flex items-end gap-1 h-5 px-1.5 py-0.5" aria-hidden="true">
                {[0, 1, 2, 3].map((bar) => (
                  <span
                    key={bar}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isSenjaMode ? 'bg-amber-400' : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                    style={{
                      height: isPlaying ? `${[14, 20, 11, 17][bar]}px` : '4px',
                      animation: isPlaying
                        ? `pulse 0.75s ease-in-out infinite alternate ${bar * 0.16}s`
                        : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Lirik Button */}
              <button
                type="button"
                onClick={toggleLyrics}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer active:scale-95 bg-white/80 dark:bg-white/10 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-300"
                aria-label="Buka Lirik Lagu"
              >
                <Mic2 size={12} className="text-amber-500" />
                <span>Lirik</span>
              </button>

              {/* Play / Pause Toggle Button (Instant zero-delay response) */}
              <button
                type="button"
                onClick={togglePlay}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 shadow-md active:scale-95 cursor-pointer ${
                  isPlaying
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-amber-500/30 hover:brightness-110'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-amber-600 dark:hover:bg-amber-400 hover:text-white dark:hover:text-slate-950'
                }`}
                aria-label={isPlaying ? 'Jeda Lagu Dunia Yang Nanti' : 'Putar Lagu Dunia Yang Nanti'}
              >
                {isPlaying ? (
                  <>
                    <Pause size={13} className="fill-current" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play size={13} className="fill-current ml-0.5" />
                    <span>Putar Musik</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Interactive Spotify-style Karaoke Lyrics Modal */}
      <SenjaLyricsModal />
    </>
  );
};

export default SenjaPlayer;
