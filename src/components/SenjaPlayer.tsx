import React from 'react';
import { Play, Pause, Disc3, Sparkles } from 'lucide-react';
import { useSenja } from '../context/SenjaContext';

const SenjaPlayer: React.FC = () => {
  const { isPlaying, isSenjaMode, togglePlay } = useSenja();

  return (
    <div className="w-full mt-6 max-w-xl" data-aos="fade-up" data-aos-delay="100">
      <div
        className={`group relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border transition-all duration-700 backdrop-blur-xl ${isSenjaMode
            ? 'bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-rose-950/40 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.22)]'
            : 'bg-white/60 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 hover:border-amber-500/30 shadow-md'
          }`}
      >
        {/* Ambient Warm Gradient Glow behind widget */}
        <div
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 blur-xl pointer-events-none transition-opacity duration-700 ${isSenjaMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
            }`}
        />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">

          {/* LEFT: Vinyl Disc + Track Details */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Rotating Vinyl Disc Artwork */}
            <div className="relative shrink-0">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center p-1 border transition-all duration-700 ${isSenjaMode
                    ? 'bg-gradient-to-tr from-amber-500 to-rose-600 border-amber-300/40 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                    : 'bg-slate-900 dark:bg-slate-800 border-white/10'
                  }`}
              >
                <Disc3
                  size={24}
                  className={`text-white transition-transform ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : 'group-hover:rotate-45'
                    }`}
                />
              </div>

              {/* Live equalizer dots on top of vinyl */}
              {isPlaying && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-white/20" />
                </span>
              )}
            </div>

            {/* Song Meta & Lyric */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  Dunia yang Nanti
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/25 shrink-0 flex items-center gap-1">
                  <Sparkles size={10} />
                  {isSenjaMode ? 'Mode Senja Aktif' : 'Raim Laode'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {isPlaying
                  ? '♫ "...kudoakan kisah kita satu di dunia yang nanti..."'
                  : 'Raim Laode — Sentuh untuk memutar lagu & ubah ke suasana senja'}
              </p>
            </div>
          </div>

          {/* RIGHT: Equalizer Bars & Play/Pause Action */}
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">

            {/* Animated Audio Equalizer Waveform */}
            <div className="flex items-end gap-1 h-5 px-2 py-0.5" aria-hidden="true">
              {[0, 1, 2, 3].map((bar) => (
                <span
                  key={bar}
                  className={`w-1 rounded-full transition-all duration-300 ${isSenjaMode ? 'bg-amber-400' : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                  style={{
                    height: isPlaying ? `${[14, 20, 10, 18][bar]}px` : '4px',
                    animation: isPlaying
                      ? `pulse 0.8s ease-in-out infinite alternate ${bar * 0.18}s`
                      : 'none',
                  }}
                />
              ))}
            </div>

            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              onClick={togglePlay}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 shadow-md active:scale-95 cursor-pointer ${isPlaying
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
  );
};

export default SenjaPlayer;
