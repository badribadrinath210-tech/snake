import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

const TRACKS = [
  { id: 'T01', title: 'NEON DRIFT - SYNTHETIC MINDS', url: 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc8b548b25.mp3', length: '4:32' },
  { id: 'T02', title: 'DATA PULSE - AI GEN', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', length: '3:15' },
  { id: 'T03', title: 'VOID CORE - AI GEN', url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3', length: '5:01' }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.warn("Audio playback constrained. Awaiting user interaction.", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, volume]);

  const togglePlay = () => setIsPlaying(prev => !prev);
  
  const skipForward = () => {
    setCurrentTrackIndex(prev => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const skipBackward = () => {
    setCurrentTrackIndex(prev => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="flex flex-col gap-4 font-mono w-full">
      {/* Playlist */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0">Signal Library</h2>
      <div className="space-y-2">
        {TRACKS.map((track, idx) => {
          const isActive = idx === currentTrackIndex;
          return (
            <div 
              key={track.id} 
              onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
              className={`p-3 flex flex-col gap-1 cursor-pointer transition-opacity ${isActive ? 'bg-[#11141b] border-l-2 border-[#00f3ff]' : 'bg-[#0d0f14] border-l-2 border-transparent opacity-50 hover:opacity-100'}`}
            >
              <span className={`text-xs font-bold ${isActive ? 'text-[#00f3ff]' : 'text-white'}`}>
                0{idx + 1}. {track.title.split(' - ')[0]}
              </span>
              <span className="text-[10px] text-gray-500">{track.length} // AI GEN</span>
              {isActive && isPlaying && (
                 <div className="flex gap-1 mt-2">
                   <div className="w-1 h-3 bg-[#00f3ff] animate-pulse"></div>
                   <div className="w-1 h-2 bg-[#00f3ff] animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                   <div className="w-1 h-4 bg-[#00f3ff] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                 </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-auto bg-[#11141b] rounded p-4 border border-[#1a1c23]">
        <div className="flex justify-between items-center mb-2">
           <div className="text-[10px] text-gray-500 uppercase">Now Playing</div>
           <div className="flex items-center gap-2">
             <span className="text-[10px] text-gray-500 uppercase">VOL</span>
             <input 
                type="range" 
                min="0" max="1" step="0.05" value={volume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-[#1a1c23] appearance-none cursor-pointer accent-[#00f3ff]"
             />
           </div>
        </div>
        <div className="text-xs mb-4 truncate text-white">{currentTrack.title}</div>
        <div className="flex justify-between items-center">
          <button onClick={skipBackward} className="p-2 text-gray-400 hover:text-white transition-colors">
            <SkipBack className="w-4 h-4" fill="currentColor" />
          </button>
          <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-[#00f3ff] text-black flex items-center justify-center hover:scale-105 transition-transform">
             {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>
          <button onClick={skipForward} className="p-2 text-gray-400 hover:text-white transition-colors">
            <SkipForward className="w-4 h-4" fill="currentColor" />
          </button>
        </div>
        <div className="mt-4 h-1 bg-[#1a1c23] w-full relative">
          <div className="absolute left-0 top-0 h-full bg-[#00f3ff] transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
        controls={false}
      />
    </div>
  );
}
