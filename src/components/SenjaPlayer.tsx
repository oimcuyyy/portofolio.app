import React from 'react';
import { Play, Pause, Mic2, Sparkles, Headphones } from 'lucide-react';
import { useSenja } from '../context/SenjaContext';
import { SenjaLyricsModal } from './SenjaLyricsModal';

export const SenjaPlayer: React.FC = () => {
  const {
    isPlaying,
    activeTheme,
    currentTime,
    duration,
    currentSongIndex,
    currentLyricText,
    songs,
    togglePlayTrack,
    openLyricsForTrack,
  } = useSenja();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div className="w-full mt-6 max-w-xl" data-aos="fade-up" data-aos-delay="100">
        
        {/* Playlist Header */}
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <Headphones
              size={14}
              className={`transition-colors duration-300 ${
                isPlaying
                  ? activeTheme === 'lany'
                    ? 'text-sky-400'
                    : activeTheme === 'hindia'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                  : 'text-emerald-500'
              }`}
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Playlist Portofolio
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
              {songs.length} Lagu
            </span>
          </div>

          {isPlaying && (
            <span className="text-[11px] font-mono flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span
                className={`w-1.5 h-1.5 rounded-full animate-ping ${
                  activeTheme === 'lany'
                    ? 'bg-sky-400'
                    : activeTheme === 'hindia'
                    ? 'bg-rose-400'
                    : 'bg-amber-400'
                }`}
              />
              <span className="truncate max-w-[150px] sm:max-w-[200px]">
                Sedang Memutar: {songs[currentSongIndex]?.title}
              </span>
            </span>
          )}
        </div>

        {/* Vertically Stacked Song Cards */}
        <div className="flex flex-col gap-2.5">
          {songs.map((song, idx) => {
            const isThisTrackActive = idx === currentSongIndex;
            const isThisPlaying = isThisTrackActive && isPlaying;

            // Theme-specific visual styling for the active song
            const isLany = isThisPlaying && song.themeId === 'lany';
            const isHindia = isThisPlaying && song.themeId === 'hindia';
            const isSenja = isThisPlaying && song.themeId === 'senja';

            // Card container styling
            const cardBgClass = isLany
              ? 'bg-gradient-to-r from-sky-950/50 via-indigo-950/40 to-purple-950/50 border-sky-500/40 shadow-[0_0_30px_rgba(56,189,248,0.22)] ring-1 ring-sky-500/25'
              : isHindia
              ? 'bg-gradient-to-r from-rose-950/50 via-red-950/40 to-slate-950/50 border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.22)] ring-1 ring-rose-500/25'
              : isSenja
              ? 'bg-gradient-to-r from-amber-950/50 via-orange-950/40 to-rose-950/50 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.22)] ring-1 ring-amber-500/25'
              : 'bg-white/70 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 hover:border-emerald-500/30 hover:bg-white/85 dark:hover:bg-white/[0.06] shadow-sm';

            // Ambient background glow behind active song
            const ambientGlow = isLany
              ? 'bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20'
              : isHindia
              ? 'bg-gradient-to-r from-rose-500/20 via-red-500/20 to-amber-500/20'
              : isSenja
              ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20'
              : 'bg-transparent';

            // Vinyl border and glow
            const vinylBorder = isLany
              ? 'border-sky-400/60 shadow-[0_0_16px_rgba(56,189,248,0.5)]'
              : isHindia
              ? 'border-rose-400/60 shadow-[0_0_16px_rgba(244,63,94,0.5)]'
              : isSenja
              ? 'border-amber-400/60 shadow-[0_0_16px_rgba(245,158,11,0.5)]'
              : 'border-slate-300 dark:border-white/15 group-hover/card:border-slate-400 dark:group-hover/card:border-white/30';

            // Pulse indicator dot color
            const pulseDotColor = isLany
              ? 'bg-sky-400'
              : isHindia
              ? 'bg-rose-400'
              : 'bg-amber-400';

            // Badge styling
            const badgeClass = isLany
              ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30'
              : isHindia
              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30'
              : isSenja
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
              : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10';

            // Play button gradient
            const playBtnClass = isLany
              ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sky-500/30'
              : isHindia
              ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-500/30'
              : isSenja
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-amber-500/30'
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-emerald-600 dark:hover:bg-emerald-400 hover:text-white dark:hover:text-slate-950';

            // Live lyric text color
            const lyricColor = isLany
              ? 'text-sky-700 dark:text-sky-300'
              : isHindia
              ? 'text-rose-700 dark:text-rose-300'
              : 'text-amber-700 dark:text-amber-300';

            // Mini progress bar gradient
            const progressBarClass = isLany
              ? 'from-sky-400 via-indigo-400 to-purple-400'
              : isHindia
              ? 'from-rose-500 via-red-500 to-amber-500'
              : 'from-amber-400 via-orange-400 to-rose-500';

            // Mic icon color
            const micColor = isLany
              ? 'text-sky-400'
              : isHindia
              ? 'text-rose-400'
              : isSenja
              ? 'text-amber-400'
              : 'text-slate-400 dark:text-slate-500';

            return (
              <div
                key={song.id}
                className={`group/card relative overflow-hidden rounded-2xl p-3 sm:p-3.5 border transition-all duration-500 backdrop-blur-xl ${cardBgClass}`}
              >
                {/* Ambient glow behind card when playing */}
                <div
                  className={`absolute -inset-1 rounded-2xl ${ambientGlow} blur-xl pointer-events-none transition-opacity duration-700 ${
                    isThisPlaying ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-4">
                  
                  {/* LEFT: Vinyl Disc with Song's Album Artwork + Metadata */}
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                    
                    {/* Rotating Vinyl Record with Cover */}
                    <div
                      onClick={() => togglePlayTrack(idx)}
                      className="relative shrink-0 cursor-pointer group/vinyl"
                      title={isThisPlaying ? `Jeda ${song.title}` : `Putar ${song.title}`}
                    >
                      {/* Outer Vinyl Disc */}
                      <div
                        className={`relative w-12 h-12 sm:w-13 sm:h-13 rounded-full vinyl-disc p-0.5 border flex items-center justify-center transition-all duration-500 shadow-md ${vinylBorder}`}
                      >
                        {/* Concentric Grooves Texture */}
                        <div className="absolute inset-0 rounded-full vinyl-grooves pointer-events-none" />

                        {/* Spinning Disc Core with Artwork */}
                        <div
                          className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex items-center justify-center ${
                            isThisPlaying
                              ? 'animate-vinyl-spin'
                              : 'animate-vinyl-paused group-hover/card:rotate-12 transition-transform duration-500'
                          }`}
                        >
                          <img
                            src={song.coverSrc}
                            alt={`${song.title} - ${song.artist}`}
                            className="w-full h-full object-cover rounded-full"
                            loading="eager"
                          />

                          {/* Glossy Sheen Overlay */}
                          <div className="absolute inset-0 rounded-full vinyl-shine pointer-events-none" />

                          {/* Center Vinyl Spindle Hole */}
                          <div className="absolute w-2.5 h-2.5 rounded-full bg-black/90 border border-slate-300 shadow-inner flex items-center justify-center">
                            <div className="w-0.5 h-0.5 rounded-full bg-slate-400" />
                          </div>
                        </div>

                        {/* Glossy Sheen */}
                        <div className="absolute inset-0 rounded-full vinyl-shine pointer-events-none" />
                      </div>

                      {/* Live Playing Pulse Indicator on Vinyl */}
                      {isThisPlaying && (
                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulseDotColor} opacity-80`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-3.5 w-3.5 ${pulseDotColor} border-2 border-slate-950`}
                          />
                        </span>
                      )}
                    </div>

                    {/* Track Title, Badge & Subtitle / Live Lyric */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {song.title}
                        </h4>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border shrink-0 flex items-center gap-1 transition-colors ${badgeClass}`}
                        >
                          <Sparkles size={10} />
                          {isThisPlaying ? song.themeBadge : `Track 0${idx + 1}`}
                        </span>
                      </div>

                      {/* Subtitle / Live Lyric line */}
                      <p
                        className={`text-xs truncate mt-0.5 transition-all duration-300 ${
                          isThisPlaying
                            ? `${lyricColor} font-medium animate-fade-in`
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                        title={isThisPlaying ? currentLyricText : song.artist}
                      >
                        {isThisPlaying ? currentLyricText : song.artist}
                      </p>

                      {/* Mini Progress Scrubber when this song is playing */}
                      {isThisPlaying && (
                        <div className="w-full max-w-[200px] h-1 rounded-full bg-slate-200 dark:bg-white/10 mt-1.5 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${progressBarClass} rounded-full transition-all duration-150`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Direct Play/Pause Button + Lirik Button */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    
                    {/* Play / Pause Toggle Button */}
                    <button
                      type="button"
                      onClick={() => togglePlayTrack(idx)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 shadow-md active:scale-95 cursor-pointer ${playBtnClass}`}
                      aria-label={isThisPlaying ? `Jeda ${song.title}` : `Putar ${song.title}`}
                    >
                      {isThisPlaying ? (
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

                    {/* Lirik Modal Trigger Button */}
                    <button
                      type="button"
                      onClick={() => openLyricsForTrack(idx)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer active:scale-95 bg-white/80 dark:bg-white/10 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 ${
                        isThisPlaying
                          ? isLany
                            ? 'hover:border-sky-400 hover:text-sky-400'
                            : isHindia
                            ? 'hover:border-rose-400 hover:text-rose-400'
                            : 'hover:border-amber-400 hover:text-amber-400'
                          : 'hover:border-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-400'
                      }`}
                      aria-label={`Buka Lirik ${song.title}`}
                      title="Lihat Lirik Karaoke"
                    >
                      <Mic2 size={12} className={micColor} />
                      <span className="hidden xs:inline">Lirik</span>
                    </button>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Spotify-style Karaoke Lyrics Modal */}
      <SenjaLyricsModal />
    </>
  );
};

export default SenjaPlayer;
