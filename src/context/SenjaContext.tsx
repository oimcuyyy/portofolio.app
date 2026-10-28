import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { DUNIA_YANG_NANTI_LYRICS } from '../data/lyrics';

interface SenjaContextType {
  isSenjaMode: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLyricsOpen: boolean;
  currentLyricIndex: number;
  currentLyricText: string;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  toggleLyrics: () => void;
  setIsLyricsOpen: (open: boolean) => void;
}

const SenjaContext = createContext<SenjaContextType | undefined>(undefined);

export const SenjaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSenjaMode, setIsSenjaMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(200.55); // ~3m20s song duration
  const [volume, setVolumeState] = useState(0.85);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Setup native HTML5 audio with zero-latency preloading
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = volume;

    // Prioritize AAC m4a with fallback to WebM
    const canPlayM4A = audio.canPlayType('audio/mp4; codecs="mp4a.40.2"');
    if (canPlayM4A === 'probably' || canPlayM4A === 'maybe') {
      audio.src = '/audio/dunia-yang-nanti.m4a';
    } else {
      audio.src = '/audio/dunia-yang-nanti.webm';
    }

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsSenjaMode(false);
      setCurrentTime(0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsSenjaMode(true);
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

  // Sync Senja Mode styling to root HTML class
  useEffect(() => {
    if (isSenjaMode) {
      document.documentElement.classList.add('senja');
    } else {
      document.documentElement.classList.remove('senja');
    }
  }, [isSenjaMode]);

  // Compute active lyric index based on currentTime
  const currentLyricIndex = useMemo(() => {
    let index = -1;
    for (let i = 0; i < DUNIA_YANG_NANTI_LYRICS.length; i++) {
      if (currentTime >= DUNIA_YANG_NANTI_LYRICS[i].time) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [currentTime]);

  const currentLyricText = useMemo(() => {
    if (currentLyricIndex >= 0 && currentLyricIndex < DUNIA_YANG_NANTI_LYRICS.length) {
      return DUNIA_YANG_NANTI_LYRICS[currentLyricIndex].text;
    }
    return isPlaying ? '♫ Raim Laode — Dunia yang Nanti' : 'Raim Laode — Sentuh untuk memutar lagu & suasana senja';
  }, [currentLyricIndex, isPlaying]);

  // Zero-delay playback trigger
  const play = () => {
    if (!audioRef.current) return;
    setIsSenjaMode(true);
    setIsPlaying(true);
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Playback interrupted or autoplay restricted:', err);
        setIsPlaying(false);
      });
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    setIsSenjaMode(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
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
        isSenjaMode,
        isPlaying,
        currentTime,
        duration,
        volume,
        isLyricsOpen,
        currentLyricIndex,
        currentLyricText,
        togglePlay,
        play,
        pause,
        seek,
        setVolume,
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
