import React from 'react';
import { Play, Pause, Mic2, Sparkles, SkipBack, SkipForward } from 'lucide-react';
import { useSenja } from '../context/SenjaContext';
import { SenjaLyricsModal } from './SenjaLyricsModal';

const SenjaPlayer: React.FC = () => {
  const {
    isPlaying,
    activeTheme,
    togglePlay,
    currentLyricText,
    toggleLyrics,
    currentTime,
    duration,
    currentSong,
    currentSongIndex,
    songs,
    selectSong,
    nextSong,
    prevSong,
  } = useSenja();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Dynamic theme card styles
  const isLany = isPlaying && activeTheme === 'lany';
  const isHindia = isPlaying && activeTheme === 'hindia';
  const isSenja = isPlaying && activeTheme === 'senja';

  const cardContainerClass = isLany
    ? 'bg-gradient-to-r from-sky-950/45 via-indigo-950/35 to-purple-950/45 border-sky-500/40 shadow-[0_0_40px_rgba(56,189,248,0.25)]'
    : isHindia
    ? 'bg-gradient-to-r from-rose-950/45 via-red-950/35 to-slate-950/45 border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.25)]'
    : isSenja
    ? 'bg-gradient-to-r from-amber-950/45 via-orange-950/35 to-rose-950/45 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.25)]'
    : 'bg-white/70 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 hover:border-emerald-500/30 shadow-md';

  const ambientGlowClass = isLany
    ? 'bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20'
    : isHindia
    ? 'bg-gradient-to-r from-rose-500/20 via-red-500/20 to-amber-500/20'
    : isSenja
    ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20'
    : 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10';

  const vinylBorderClass = isLany
    ? 'border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.5)]'
    : isHindia
    ? 'border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.5)]'
    : isSenja
    ? 'border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
    : 'border-white/15 group-hover/vinyl:border-emerald-400/40';

  const pulseDotBg = isLany
    ? 'bg-sky-400'
    : isHindia
    ? 'bg-rose-400'
    : 'bg-amber-400';

  const badgeBadgeClass = isLany
    ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/25'
    : isHindia
    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/25'
    : isSenja
    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25'
    : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10';

  const playBtnGradient = isLany
    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sky-500/30'
    : isHindia
    ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-500/30'
    : isSenja
    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-amber-500/30'
    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-emerald-600 dark:hover:bg-emerald-400';

  const progressBarGradient = isLany
    ? 'from-sky-400 via-indigo-400 to-purple-400'
    : isHindia
    ? 'from-rose-500 via-red-500 to-amber-500'
    : 'from-amber-400 via-orange-400 to-rose-500';

  const lyricTextColor = isLany
    ? 'text-sky-700 dark:text-sky-300'
    : isHindia
    ? 'text-rose-700 dark:text-rose-300'
    : isSenja
    ? 'text-amber-700 dark:text-amber-300'
    : 'text-slate-500 dark:text-slate-400';

  return (
    <>
      <div className="w-full mt-6 max-w-xl" data-aos="fade-up" data-aos-delay="100">
        <div
          className={`group relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border transition-all duration-700 backdrop-blur-xl ${cardContainerClass}`}
        >
          {/* Ambient Warm Sunset/Dreamy Glow behind widget */}
          <div
            className={`absolute -inset-1 rounded-2xl ${ambientGlowClass} blur-xl pointer-events-none transition-opacity duration-700 ${
              isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
            }`}
          />

          <div className="relative z-10 flex flex-col gap-3">
            {/* TOP ROW: Track Info, Vinyl, Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              
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
                    className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full vinyl-disc p-1 border flex items-center justify-center transition-all duration-700 shadow-lg ${vinylBorderClass}`}
                  >
                    {/* Concentric Grooves Texture */}
                    <div className="absolute inset-0 rounded-full vinyl-grooves pointer-events-none" />

                    {/* Spinning Disc Core with Artwork */}
                    <div
                      className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center ${
                        isPlaying ? 'animate-vinyl-spin' : 'animate-vinyl-paused'
                      }`}
                    >
                      <img
                        src={currentSong.coverSrc}
                        alt={`${currentSong.title} - ${currentSong.artist}`}
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
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulseDotBg} opacity-80`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-3.5 w-3.5 ${pulseDotBg} border-2 border-slate-950`}
                      />
                    </span>
                  )}
                </div>

                {/* TRACK TITLE, ARTIST & DYNAMIC LYRIC PREVIEW */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {currentSong.title}
                    </h4>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border shrink-0 flex items-center gap-1 transition-colors ${badgeBadgeClass}`}
                    >
                      <Sparkles size={10} />
                      {isPlaying ? currentSong.themeBadge : currentSong.artist}
                    </span>
                  </div>

                  {/* Subtitle / Live Lyric Line */}
                  <p
                    className={`text-xs truncate mt-0.5 transition-all duration-300 ${
                      isPlaying
                        ? `${lyricTextColor} font-medium animate-fade-in`
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
                        className={`h-full bg-gradient-to-r ${progressBarGradient} rounded-full transition-all duration-150`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Prev, Play/Pause, Next & Lirik Button */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-center">
                {/* Skip Prev Button */}
                <button
                  type="button"
                  onClick={prevSong}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer active:scale-95"
                  aria-label="Lagu Sebelumnya"
                  title="Lagu Sebelumnya"
                >
                  <SkipBack size={15} />
                </button>

                {/* Play / Pause Toggle Button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 shadow-md active:scale-95 cursor-pointer ${playBtnGradient}`}
                  aria-label={isPlaying ? `Jeda ${currentSong.title}` : `Putar ${currentSong.title}`}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={13} className="fill-current" />
                      <span>Jeda</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} className="fill-current ml-0.5" />
                      <span>Putar</span>
                    </>
                  )}
                </button>

                {/* Skip Next Button */}
                <button
                  type="button"
                  onClick={nextSong}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer active:scale-95"
                  aria-label="Lagu Berikutnya"
                  title="Lagu Berikutnya"
                >
                  <SkipForward size={15} />
                </button>

                {/* Lirik Modal Trigger Button */}
                <button
                  type="button"
                  onClick={toggleLyrics}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer active:scale-95 bg-white/80 dark:bg-white/10 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-300 ml-1"
                  aria-label="Buka Lirik Lagu"
                  title="Lihat Lirik Karaoke"
                >
                  <Mic2 size={12} className="text-amber-500" />
                  <span className="hidden xs:inline">Lirik</span>
                </button>
              </div>

            </div>

            {/* BOTTOM TRACK SELECTOR PILLS */}
            <div className="pt-2 border-t border-slate-200/50 dark:border-white/[0.06] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                Playlist:
              </span>
              {songs.map((song, idx) => {
                const isSelected = idx === currentSongIndex;
                return (
                  <button
                    key={song.id}
                    onClick={() => selectSong(idx)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all duration-300 whitespace-nowrap cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent font-bold shadow-sm scale-[1.02]'
                        : 'bg-white/50 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <span>{idx + 1}.</span>
                    <span>{song.title}</span>
                  </button>
                );
              })}
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
