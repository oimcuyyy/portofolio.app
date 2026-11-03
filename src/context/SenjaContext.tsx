import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SONGS_PLAYLIST, type Song, type ThemeType } from '../data/songs';

export interface SenjaPlaybackContextType {
  // Low-frequency playback state (does NOT re-render on audio time ticks)
  isPlaying: boolean;
  isSenjaMode: boolean; // backwards compatibility
  activeTheme: ThemeType | null;
  duration: number;
  volume: number;

  // Playlist & current track
  songs: Song[];
  currentSong: Song;
  currentSongIndex: number;

  // Lyrics modal visibility
  isLyricsOpen: boolean;

  // Stable Actions
  togglePlay: () => void;
  togglePlayTrack: (index: number) => void;
  openLyricsForTrack: (index: number) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  selectSong: (index: number) => void;
  nextSong: () => void;
  prevSong: () => void;
  toggleLyrics: () => void;
  setIsLyricsOpen: (open: boolean) => void;
}

export interface SenjaTimeContextType {
  // High-frequency playback state (updates ~4-5 times/sec only for consumers that need live progress/lyrics)
  currentTime: number;
  currentLyricIndex: number;
  currentLyricText: string;
  progressPercent: number;
}

export type SenjaContextType = SenjaPlaybackContextType & SenjaTimeContextType;

const SenjaPlaybackContext = createContext<SenjaPlaybackContextType | undefined>(undefined);
const SenjaTimeContext = createContext<SenjaTimeContextType | undefined>(undefined);

export const SenjaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songs] = useState<Song[]>(SONGS_PLAYLIST);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);

  const currentSong = songs[currentSongIndex] || songs[0];
  const [duration, setDuration] = useState(currentSong.duration);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize native HTML5 audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = volume;
    audio.src = currentSong.audioSrc;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      // Auto-advance cleanly to next track
      handleNextSong();
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Sync active theme class to document root HTML when music is playing
  const activeTheme: ThemeType | null = isPlaying ? currentSong.themeId : null;
  const isSenjaMode = isPlaying;

  useEffect(() => {
    const root = document.documentElement;
    // Clean up all theme classes
    root.classList.remove('senja', 'theme-lany', 'theme-hindia');

    if (isPlaying) {
      if (currentSong.themeId === 'senja') {
        root.classList.add('senja');
      } else if (currentSong.themeId === 'lany') {
        root.classList.add('theme-lany');
      } else if (currentSong.themeId === 'hindia') {
        root.classList.add('theme-hindia');
      }
    }

    return () => {
      root.classList.remove('senja', 'theme-lany', 'theme-hindia');
    };
  }, [isPlaying, currentSong.themeId]);

  // Compute active lyric index based on currentTime & currentSong lyrics
  const currentLyricIndex = useMemo(() => {
    const lyrics = currentSong.lyrics;
    let index = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [currentTime, currentSong]);

  const currentLyricText = useMemo(() => {
    const lyrics = currentSong.lyrics;
    if (currentLyricIndex >= 0 && currentLyricIndex < lyrics.length) {
      return lyrics[currentLyricIndex].text;
    }
    return isPlaying
      ? `♫ ${currentSong.artist} — ${currentSong.title}`
      : currentSong.artist;
  }, [currentLyricIndex, isPlaying, currentSong]);

  // Play / Pause / Seek / Volume Controls
  const play = useCallback(() => {
    if (!audioRef.current) return;
    setIsPlaying(true);
    audioRef.current.play().catch((err) => {
      console.warn('Playback interrupted or restricted:', err);
      setIsPlaying(false);
    });
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      play();
    } else {
      pause();
    }
  }, [play, pause]);

  // Unified single-source track change to prevent race conditions or double audio buffer resets
  const changeTrack = useCallback((index: number, autoPlay: boolean = true) => {
    if (index < 0 || index >= songs.length) return;
    const targetSong = songs[index];
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setDuration(targetSong.duration);

    if (audioRef.current) {
      // Set new audio source cleanly
      audioRef.current.src = targetSong.audioSrc;
      audioRef.current.currentTime = 0;

      if (autoPlay) {
        setIsPlaying(true);
        audioRef.current.play().catch((err) => {
          console.warn('Playback error on track switch:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [songs]);

  const togglePlayTrack = useCallback((index: number) => {
    if (index < 0 || index >= songs.length) return;
    if (index === currentSongIndex) {
      togglePlay();
      return;
    }
    changeTrack(index, true);
  }, [currentSongIndex, togglePlay, changeTrack]);

  const openLyricsForTrack = useCallback((index: number) => {
    if (index < 0 || index >= songs.length) return;
    if (index !== currentSongIndex) {
      changeTrack(index, false);
    }
    setIsLyricsOpen(true);
  }, [currentSongIndex, changeTrack]);

  const selectSong = useCallback((index: number) => {
    changeTrack(index, true);
  }, [changeTrack]);

  const handleNextSong = useCallback(() => {
    setCurrentSongIndex((prev) => {
      const nextIndex = (prev + 1) % songs.length;
      changeTrack(nextIndex, isPlaying);
      return nextIndex;
    });
  }, [songs.length, changeTrack, isPlaying]);

  const handlePrevSong = useCallback(() => {
    setCurrentSongIndex((prev) => {
      const prevIndex = (prev - 1 + songs.length) % songs.length;
      changeTrack(prevIndex, isPlaying);
      return prevIndex;
    });
  }, [songs.length, changeTrack, isPlaying]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(time, duration));
    audioRef.current.currentTime = clamped;
    setCurrentTime(clamped);
    if (!isPlaying) {
      play();
    }
  }, [duration, isPlaying, play]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(v, 1));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const toggleLyrics = useCallback(() => {
    setIsLyricsOpen((prev) => !prev);
  }, []);

  // Memoize low-frequency playback value (ZERO re-renders on audio time ticks)
  const playbackValue = useMemo<SenjaPlaybackContextType>(() => ({
    isPlaying,
    isSenjaMode,
    activeTheme,
    duration,
    volume,
    songs,
    currentSong,
    currentSongIndex,
    isLyricsOpen,
    togglePlay,
    togglePlayTrack,
    openLyricsForTrack,
    play,
    pause,
    seek,
    setVolume,
    selectSong,
    nextSong: handleNextSong,
    prevSong: handlePrevSong,
    toggleLyrics,
    setIsLyricsOpen,
  }), [
    isPlaying,
    isSenjaMode,
    activeTheme,
    duration,
    volume,
    songs,
    currentSong,
    currentSongIndex,
    isLyricsOpen,
    togglePlay,
    togglePlayTrack,
    openLyricsForTrack,
    play,
    pause,
    seek,
    setVolume,
    selectSong,
    handleNextSong,
    handlePrevSong,
    toggleLyrics,
  ]);

  // Memoize high-frequency time value (only updates consumers that display progress/lyrics)
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const timeValue = useMemo<SenjaTimeContextType>(() => ({
    currentTime,
    currentLyricIndex,
    currentLyricText,
    progressPercent,
  }), [currentTime, currentLyricIndex, currentLyricText, progressPercent]);

  return (
    <SenjaPlaybackContext.Provider value={playbackValue}>
      <SenjaTimeContext.Provider value={timeValue}>
        {children}
      </SenjaTimeContext.Provider>
    </SenjaPlaybackContext.Provider>
  );
};

// Specialized hook for components needing play state & themes without time ticks
export const useSenjaPlayback = (): SenjaPlaybackContextType => {
  const context = useContext(SenjaPlaybackContext);
  if (!context) {
    throw new Error('useSenjaPlayback must be used within a SenjaProvider');
  }
  return context;
};

// Specialized hook for components needing live currentTime & lyrics
export const useSenjaTime = (): SenjaTimeContextType => {
  const context = useContext(SenjaTimeContext);
  if (!context) {
    throw new Error('useSenjaTime must be used within a SenjaProvider');
  }
  return context;
};

// Full combined hook for backward compatibility
export const useSenja = (): SenjaContextType => {
  const playback = useSenjaPlayback();
  const time = useSenjaTime();
  return {
    ...playback,
    ...time,
  };
};
