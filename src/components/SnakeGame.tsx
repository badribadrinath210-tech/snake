import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 24;
const INITIAL_SNAKE = [
  { x: 12, y: 12 },
  { x: 12, y: 13 },
  { x: 12, y: 14 }
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

type Point = { x: number; y: number };

export function SnakeGame({ onScoreUpdate, score }: { onScoreUpdate: (score: number) => void, score: number }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Use a ref to track the latest direction state to prevent rapid double-turn suicides
  const directionRef = useRef(direction);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    onScoreUpdate(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    spawnFood(INITIAL_SNAKE);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd', 'r'].includes(e.key.toLowerCase()) || e.key === ' ') {
        if (e.target === document.body || (e.target as HTMLElement).tagName !== 'INPUT') {
            e.preventDefault();
        }
      }

      if (e.key.toLowerCase() === 'r') {
        resetGame();
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        if (gameOver) {
          resetGame();
        } else if (hasStarted) {
          setIsPaused(p => !p);
        } else {
          resetGame();
        }
        return;
      }

      if (isPaused || gameOver) return;

      const { x, y } = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused, hasStarted, spawnFood, onScoreUpdate]);

  // Update ref whenever direction state updates
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const gameLoop = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y
      };

      // Collision with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Eat food
      if (newHead.x === food.x && newHead.y === food.y) {
        onScoreUpdate(score + 10 * (1 + Math.floor(score / 100)));
        spawnFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, spawnFood, score, onScoreUpdate]);

  useEffect(() => {
    // Increase speed slightly as score increases
    const currentSpeed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    const interval = setInterval(gameLoop, currentSpeed);
    return () => clearInterval(interval);
  }, [gameLoop, score]);

  return (
    <div className="flex flex-col items-center relative select-none w-full max-w-[480px]">
      
      {/* Game Header State Over Container */}
      <div className="w-full flex justify-between items-end mb-4">
         <div className="flex items-center gap-6">
             <div className="text-right">
                <span className="block text-[10px] text-gray-500 uppercase">Current Score</span>
                <span className="text-3xl font-bold text-[#39ff14]">{score.toString().padStart(4, '0')}</span>
             </div>
         </div>
         
         <div className="text-[10px] text-gray-500 uppercase tracking-widest text-right">
            {gameOver ? <span className="text-[#ff0055]">SYSTEM OFFLINE</span> : isPaused ? (hasStarted ? 'STANDBY' : 'AWAITING INPUT') : <span className="text-[#00f3ff]">ACTIVE</span>}
         </div>
      </div>

      <div className="relative w-full">
          <div className="absolute inset-0 bg-[#39ff14] opacity-[0.02] blur-[100px] pointer-events-none"></div>
          
          <div className="w-full aspect-square bg-[#050608] border-2 border-[#1a1c23] relative rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden" style={{ minWidth: '300px' }}>
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(#1a1c23 1px, transparent 1px), linear-gradient(90deg, #1a1c23 1px, transparent 1px)',
                backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
            }}></div>

            {/* Render Food element */}
            <div 
              className="absolute bg-[#ff0055] rounded-full animate-pulse z-10"
              style={{
                left: `${(food.x / GRID_SIZE) * 100}%`,
                top: `${(food.y / GRID_SIZE) * 100}%`,
                width: `${(1 / GRID_SIZE) * 100}%`,
                height: `${(1 / GRID_SIZE) * 100}%`,
                boxShadow: '0 0 15px #ff0055',
                transform: 'scale(0.8)'
              }}
            />

            {/* Render Snake */}
            {snake.map((segment, index) => {
              const isHead = index === 0;
              const opacity = Math.max(0.2, 1 - (index / snake.length) * 0.8);
              return (
                <div
                  key={index}
                  className="absolute bg-[#39ff14] transition-all duration-[50ms]"
                  style={{
                    left: `${(segment.x / GRID_SIZE) * 100}%`,
                    top: `${(segment.y / GRID_SIZE) * 100}%`,
                    width: `${(1 / GRID_SIZE) * 100}%`,
                    height: `${(1 / GRID_SIZE) * 100}%`,
                    boxShadow: isHead ? '0 0 10px #39ff14' : 'none',
                    opacity: opacity,
                    zIndex: isHead ? 20 : 15
                  }}
                />
              );
            })}

            {/* Game UI Labels */}
            <div className="absolute top-2 left-2 text-[8px] text-gray-700 tracking-tighter z-30">SYSTEM_STATUS: {gameOver ? 'FAIL' : 'OK'}</div>
            <div className="absolute bottom-2 right-2 text-[8px] text-gray-700 tracking-tighter z-30">GRID_READY: {GRID_SIZE}x{GRID_SIZE}</div>

            {/* Overlays */}
            {!hasStarted && !gameOver && (
              <div className="absolute inset-0 bg-[#050608]/80 flex flex-col justify-center items-center z-40 backdrop-blur-[2px]">
                <p className="text-xl mb-6 text-[#00f3ff] text-center animate-pulse tracking-widest font-bold">INITIALIZE SYNTH.SNAKE</p>
                <button 
                  onClick={resetGame}
                  className="border border-[#00f3ff] text-[#00f3ff] py-2 px-6 hover:bg-[#00f3ff] hover:text-black transition-colors uppercase text-xs tracking-widest font-bold"
                >
                  Start Protocol
                </button>
              </div>
            )}

            {isPaused && hasStarted && !gameOver && (
              <div className="absolute inset-0 bg-[#050608]/60 flex flex-col justify-center items-center z-40 backdrop-blur-sm">
                <p className="animate-pulse tracking-widest text-[#00f3ff] font-bold">PAUSE</p>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-[#050608]/90 flex flex-col justify-center items-center z-40">
                <p className="text-2xl text-[#ff0055] mb-2 tracking-widest font-bold drop-shadow-[0_0_8px_rgba(255,0,85,0.5)]">SIGNAL LOST</p>
                <p className="text-gray-400 mb-8 text-sm">FINAL SCORE: <span className="text-[#39ff14] font-bold">{score}</span></p>
                <button 
                  onClick={resetGame}
                  className="border border-[#ff0055] text-[#ff0055] py-2 px-8 hover:bg-[#ff0055] hover:text-black transition-colors uppercase text-xs tracking-widest font-bold focus:outline-none"
                >
                  Restart
                </button>
              </div>
            )}

          </div>
          
          {/* Game Controls Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-[10px] text-gray-500 uppercase tracking-[0.2em] w-full">
            <div className="flex items-center gap-2"><span className="border border-gray-700 px-1 py-0.5">WASD</span> MOVE</div>
            <div className="flex items-center gap-2"><span className="border border-gray-700 px-1 py-0.5">SPACE</span> PAUSE</div>
            <div className="flex items-center gap-2"><span className="border border-gray-700 px-1 py-0.5">R</span> RESET</div>
          </div>
      </div>
    </div>
  );
}
