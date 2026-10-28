import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface SenjaContextType {
  isSenjaMode: boolean;
  isPlaying: boolean;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  volume: number;
  setVolume: (v: number) => void;
}

const SenjaContext = createContext<SenjaContextType | undefined>(undefined);

// Web Audio Ambient Acoustic Guitar Engine (Dunia Yang Nanti chords: D - F#m - G - A)
class AcousticSunsetSynthesizer {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private timer: any = null;

  start() {
    if (this.isRunning) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.isRunning = true;

      // Chord progression for "Dunia Yang Nanti" (D, F#m, G, A) in Hz
      const chords = [
        [146.83, 220.00, 293.66, 369.99, 440.00], // D Major
        [185.00, 220.00, 277.18, 369.99, 440.00], // F# minor
        [196.00, 246.94, 293.66, 392.00, 493.88], // G Major
        [220.00, 277.18, 329.63, 440.00, 554.37], // A Major
      ];

      let chordIdx = 0;
      let noteIdx = 0;

      const playPluck = () => {
        if (!this.isRunning || !this.ctx) return;
        const currentChord = chords[chordIdx];
        const freq = currentChord[noteIdx % currentChord.length];

        this.pluckNote(freq);

        noteIdx++;
        if (noteIdx >= 8) {
          noteIdx = 0;
          chordIdx = (chordIdx + 1) % chords.length;
        }

        // Fingerstyle tempo ~ 105 BPM
        this.timer = setTimeout(playPluck, 280);
      };

      playPluck();
    } catch (e) {
      console.warn('Acoustic synthesizer fallback error:', e);
    }
  }

  private pluckNote(freq: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm acoustic guitar sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Warm low-pass acoustic resonance
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.8);

    // Pluck envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.3);
  }

  stop() {
    this.isRunning = false;
    if (this.timer) clearTimeout(this.timer);
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch { }
      this.ctx = null;
    }
  }
}

export const SenjaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSenjaMode, setIsSenjaMode] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const synthRef = useRef<AcousticSunsetSynthesizer | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const isYtReadyRef = useRef<boolean>(false);

  // Initialize YouTube Iframe Player in background
  useEffect(() => {
    synthRef.current = new AcousticSunsetSynthesizer();

    // Function to initialize YT player
    const initYT = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        try {
          ytPlayerRef.current = new (window as any).YT.Player('senja-youtube-frame', {
            height: '1',
            width: '1',
            videoId: 'awWKxGftWh4', // Raim Laode - Dunia Yang Nanti (Official)
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              enablejsapi: 1,
              fs: 0,
              modestbranding: 1,
              playsinline: 1,
              rel: 0,
              origin: window.location.origin,
            },
            events: {
              onReady: () => {
                isYtReadyRef.current = true;
                if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
                  ytPlayerRef.current.setVolume(Math.round(volume * 100));
                }
              },
              onStateChange: (event: any) => {
                // YT.PlayerState.ENDED = 0
                if (event.data === 0) {
                  pause();
                }
              },
              onError: (err: any) => {
                console.warn('[Senja Music] YouTube player fallback to synth:', err);
              },
            },
          });
        } catch (e) {
          console.warn('[Senja Music] YT embed init warning:', e);
        }
      }
    };

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      (window as any).onYouTubeIframeAPIReady = initYT;
    } else {
      initYT();
    }

    return () => {
      synthRef.current?.stop();
      try {
        ytPlayerRef.current?.destroy();
      } catch { }
    };
  }, []);

  // Sync document class when Senja Mode changes
  useEffect(() => {
    if (isSenjaMode) {
      document.documentElement.classList.add('senja');
    } else {
      document.documentElement.classList.remove('senja');
    }
  }, [isSenjaMode]);

  const play = () => {
    setIsPlaying(true);
    setIsSenjaMode(true);

    let playedYT = false;
    if (ytPlayerRef.current && isYtReadyRef.current) {
      try {
        ytPlayerRef.current.playVideo();
        playedYT = true;
      } catch (err) {
        console.warn('YT play failed, using acoustic fallback', err);
      }
    }

    // If YouTube isn't ready or blocked, immediately play acoustic synthesizer
    if (!playedYT) {
      synthRef.current?.start();
    }
  };

  const pause = () => {
    setIsPlaying(false);
    setIsSenjaMode(false);

    try {
      if (ytPlayerRef.current && isYtReadyRef.current) {
        ytPlayerRef.current.pauseVideo();
      }
    } catch { }

    synthRef.current?.stop();
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <SenjaContext.Provider
      value={{
        isSenjaMode,
        isPlaying,
        togglePlay,
        play,
        pause,
        volume,
        setVolume,
      }}
    >
      {children}
      {/* Invisible YouTube Player Container */}
      <div
        id="senja-yt-wrapper"
        className="fixed -top-[9999px] -left-[9999px] w-[1px] h-[1px] opacity-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div id="senja-youtube-frame" />
      </div>
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
