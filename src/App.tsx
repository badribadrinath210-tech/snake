/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal, Activity } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-[#e0e0e0] font-mono flex flex-col p-4 sm:p-8 overflow-hidden items-center">
      {/* Header section */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-10 border-b border-[#1a1c23] pb-6 mt-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">
            SYNTH.SNAKE
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            Experimental Audio-Visual Unit // v2.04
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
              <span className="block text-[10px] text-gray-500 uppercase">Core Status</span>
              <span className="text-lg font-bold text-[#39ff14] flex items-center gap-2">
                <Activity className="w-4 h-4" /> NOMINAL
              </span>
          </div>
        </div>
      </header>

      {/* Main interface */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 relative items-stretch">
        
        {/* Left Side Panel */}
        <aside className="w-full lg:w-[280px] flex flex-col gap-4 shrink-0 order-2 lg:order-1">
          <MusicPlayer />
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 flex justify-center w-full order-1 lg:order-2 z-20">
          <SnakeGame onScoreUpdate={setScore} score={score} />
        </main>
        
        {/* Right Sidebar: Stats & Diagnostics */}
        <aside className="w-full lg:w-[280px] flex flex-col shrink-0 order-3">
          <div className="mb-8">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Hardware Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-end text-[10px]">
                <span className="text-gray-500">CPU LOAD</span>
                <span className="text-[#00f3ff]">32%</span>
              </div>
              <div className="h-[2px] bg-[#1a1c23] w-full">
                <div className="h-full bg-[#00f3ff] w-1/3"></div>
              </div>
              <div className="flex justify-between items-end text-[10px]">
                <span className="text-gray-500">LATENCY</span>
                <span className="text-[#39ff14]">14ms</span>
              </div>
              <div className="h-[2px] bg-[#1a1c23] w-full">
                <div className="h-full bg-[#39ff14] w-1/6"></div>
              </div>
            </div>
          </div>

          <div className="bg-[#11141b] border border-[#1a1c23] p-4 flex-1 flex flex-col min-h-[200px]">
            <div className="text-[10px] text-gray-500 uppercase mb-4 flex items-center gap-2">
               <Terminal className="w-3 h-3" /> Telemetry Log
            </div>
            <div className="flex-1 font-mono text-[9px] text-gray-600 space-y-1 overflow-hidden">
              <div>[04:22:11] SEED_INIT_SUCCESS</div>
              <div>[04:22:15] AUDIO_STREAM_BUFFERED</div>
              <div>[04:22:19] COLLISION_DETECTED: NONE</div>
              <div className="text-[#39ff14]">[04:23:01] POINT_GAINED: +10</div>
              <div>[04:23:05] TEMP_STABLE: 34C</div>
              <div>[04:23:08] VELOCITY_INC: 1.04x</div>
              <div className="animate-pulse">_</div>
            </div>
          </div>

          <button className="mt-4 w-full py-4 bg-transparent border-2 border-[#ff0055] text-[#ff0055] font-bold uppercase tracking-widest text-xs hover:bg-[#ff0055] hover:text-black transition-colors focus:outline-none">
            Self Destruct / Quit
          </button>
        </aside>
      </div>

      <footer className="w-full max-w-6xl mt-8 pt-4 border-t border-[#1a1c23] flex flex-wrap gap-4 justify-between text-[9px] text-gray-700">
        <div>CORE_OS // USER: PLAYER_01</div>
        <div>NEON_ESTHETIC_MODULE_ACTIVE</div>
        <div>2026 © SYNTH_VOID_LABS</div>
      </footer>
    </div>
  );
}
