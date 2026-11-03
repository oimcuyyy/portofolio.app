import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { SONGS_PLAYLIST, type Song, type ThemeType } from '../data/songs';

interface SenjaContextType {
  // Playback state
  isPlaying: boolean;
  isSenjaMode: boolean; // true when music is playing (backwards compatibility)
  activeTheme: ThemeType | null;
  currentTime: number;
  duration: number;
  volume: number;

  // Playlist & current track
  songs: Song[];
  currentSong: Song;
  currentSongIndex: number;

  // Lyrics
  isLyricsOpen: boolean;
  currentLyricIndex: number;
  currentLyricText: string;

  // Actions
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

const SenjaContext = createContext<SenjaContextType | undefined>(undefined);

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
      // Auto-advance to next song on finish
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
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

  // When song index changes, update audio src smoothly
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const shouldKeepPlaying = isPlaying;

    if (!audio.src.endsWith(currentSong.audioSrc)) {
      audio.src = currentSong.audioSrc;
      audio.currentTime = 0;
      setCurrentTime(0);
      setDuration(currentSong.duration);

      if (shouldKeepPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Playback error on song switch:', err);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentSongIndex]);

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
  const play = () => {
    if (!audioRef.current) return;
    setIsPlaying(true);
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Playback interrupted or restricted:', err);
        setIsPlaying(false);
      });
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const togglePlayTrack = (index: number) => {
    if (index < 0 || index >= songs.length) return;
    if (index === currentSongIndex) {
      togglePlay();
      return;
    }

    const targetSong = songs[index];
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setDuration(targetSong.duration);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.src = targetSong.audioSrc;
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback error on track switch:', err);
          setIsPlaying(false);
        });
      }
    }
  };

  const openLyricsForTrack = (index: number) => {
    if (index < 0 || index >= songs.length) return;
    if (index !== currentSongIndex) {
      setCurrentSongIndex(index);
      if (audioRef.current) {
        audioRef.current.src = songs[index].audioSrc;
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setDuration(songs[index].duration);
      }
    }
    setIsLyricsOpen(true);
  };

  const selectSong = (index: number) => {
    if (index >= 0 && index < songs.length) {
      setCurrentSongIndex(index);
      if (!isPlaying) {
        setIsPlaying(true);
        setTimeout(() => {
          audioRef.current?.play().catch(console.warn);
        }, 50);
      }
    }
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(time, duration));
    audioRef.current.currentTime = clamped;
    setCurrentTime(clamped);
    if (!isPlaying) {
      play();
    }
  };

  const setVolume = (v: number) => {
    const clamped = Math.max(0, Math.min(v, 1));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const toggleLyrics = () => {
    setIsLyricsOpen((prev) => !prev);
  };

  return (
    <SenjaContext.Provider
      value={{
        isPlaying,
        isSenjaMode,
        activeTheme,
        currentTime,
        duration,
        volume,
        songs,
        currentSong,
        currentSongIndex,
        isLyricsOpen,
        currentLyricIndex,
        currentLyricText,
        togglePlay,
        togglePlayTrack,
        openLyricsForTrack,
        play,
        pause,
        seek,
        setVolume,
        selectSong,
        nextSong,
        prevSong,
        toggleLyrics,
        setIsLyricsOpen,
      }}
    >
      {children}
    </SenjaContext.Provider>
  );
};

export const useSenja = (): SenjaContextType => {
  const context = useContext(SenjaContext);
  if (!context) {
    throw new Error('useSenja must be used within a SenjaProvider');
  }
  return context;
};
