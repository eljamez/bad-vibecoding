'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Position {
  x: number;
  y: number;
}

interface Score {
  id: string;
  playerName: string;
  score: number;
  createdAt: string;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 100; // milliseconds

export default function SnakePage() {
  const { data: session } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState<Score[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  // Set player name from session when available
  useEffect(() => {
    if (session?.user?.name && !playerName) {
      setPlayerName(session.user.name);
    }
  }, [session, playerName]);

  // Show name input when game ends only if user is not logged in
  useEffect(() => {
    if (gameOver && !session?.user?.name) {
      setShowNameInput(true);
    } else if (gameOver && session?.user?.name) {
      setShowNameInput(false);
    }
  }, [gameOver, session]);

  // Refs to hold current values for the game loop
  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  const foodRef = useRef(food);
  const gameOverRef = useRef(gameOver);
  const gameStartedRef = useRef(gameStarted);
  const isPausedRef = useRef(isPaused);

  // Update refs when state changes
  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    gameStartedRef.current = gameStarted;
  }, [gameStarted]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const fetchHighScores = useCallback(async () => {
    try {
      const response = await fetch('/api/snake-scores');
      if (response.ok) {
        const scores = await response.json();
        setHighScores(scores);
      }
    } catch (error) {
      console.error('Error fetching high scores:', error);
    }
  }, []);

  // Fetch high scores
  useEffect(() => {
    fetchHighScores();
  }, [fetchHighScores]);

  const generateFood = useCallback((): Position => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Make sure food doesn't spawn on snake
    const isOnSnake = snakeRef.current.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    );
    // eslint-disable-next-line react-hooks/immutability
    return isOnSnake ? generateFood() : newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
    setShowNameInput(false);
    setIsPaused(false);
  }, [generateFood]);

  const startGame = useCallback(() => {
    resetGame();
    setGameStarted(true);
  }, [resetGame]);

  const togglePause = useCallback(() => {
    if (gameStarted && !gameOver) {
      setIsPaused((prev) => !prev);
    }
  }, [gameStarted, gameOver]);

  const saveScore = async () => {
    const nameToSave = playerName.trim() || session?.user?.name;
    
    if (!nameToSave) {
      alert('Please enter your name!');
      return;
    }

    try {
      const response = await fetch('/api/snake-scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName: nameToSave,
          score,
        }),
      });

      if (response.ok) {
        await fetchHighScores();
        setShowNameInput(false);
        // Don't clear playerName if it came from session
        if (!session?.user?.name) {
          setPlayerName('');
        }
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!gameStartedRef.current || gameOverRef.current || isPausedRef.current) {
        return;
      }

      const currentSnake = [...snakeRef.current];
      const currentDirection = directionRef.current;
      const currentFood = foodRef.current;
      const head = { ...currentSnake[0] };

      // Move head
      switch (currentDirection) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }

      // Check self collision
      if (currentSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      const newSnake = [head, ...currentSnake];

      // Check food collision
      if (head.x === currentFood.x && head.y === currentFood.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [generateFood]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStartedRef.current) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        togglePause();
        return;
      }

      if (gameOverRef.current) return;

      const currentDirection = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault(); // Prevent page scrolling
          if (currentDirection !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault(); // Prevent page scrolling
          if (currentDirection !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault(); // Prevent page scrolling
          if (currentDirection !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault(); // Prevent page scrolling
          if (currentDirection !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [startGame, togglePause]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#10b981' : '#34d399';
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
      
      // Add eyes to head
      if (index === 0) {
        ctx.fillStyle = '#000';
        const eyeSize = 3;
        if (direction === 'RIGHT') {
          ctx.fillRect(segment.x * CELL_SIZE + 12, segment.y * CELL_SIZE + 5, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + 12, segment.y * CELL_SIZE + 12, eyeSize, eyeSize);
        } else if (direction === 'LEFT') {
          ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + 5, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + 12, eyeSize, eyeSize);
        } else if (direction === 'UP') {
          ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + 5, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + 12, segment.y * CELL_SIZE + 5, eyeSize, eyeSize);
        } else {
          ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + 12, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + 12, segment.y * CELL_SIZE + 12, eyeSize, eyeSize);
        }
      }
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [snake, food, direction]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center text-green-300 hover:text-green-100 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/30 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                  <span className="text-5xl">🐍</span>
                  Snake Game
                </h1>
                <div className="text-right">
                  <div className="text-sm text-green-300 mb-1">Score</div>
                  <div className="text-3xl font-bold text-white">{score}</div>
                </div>
              </div>

              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={GRID_SIZE * CELL_SIZE}
                  height={GRID_SIZE * CELL_SIZE}
                  className="border-4 border-green-500/50 rounded-xl w-full shadow-2xl"
                  style={{ maxWidth: '400px', margin: '0 auto', display: 'block' }}
                />

                {/* Game overlay messages */}
                {!gameStarted && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                    <div className="text-center">
                      <p className="text-2xl text-white mb-4 font-bold">Press SPACE or ENTER to Start</p>
                      <p className="text-green-300">Use Arrow Keys or WASD to move</p>
                    </div>
                  </div>
                )}

                {isPaused && gameStarted && !gameOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                    <div className="text-center">
                      <p className="text-4xl text-white mb-4 font-bold">PAUSED</p>
                      <p className="text-green-300">Press SPACE to Resume</p>
                    </div>
                  </div>
                )}

                {gameOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
                    <div className="text-center bg-slate-800 p-8 rounded-2xl border border-red-500/50">
                      <p className="text-4xl text-red-400 mb-2 font-bold">Game Over!</p>
                      <p className="text-2xl text-white mb-4">Final Score: {score}</p>
                      
                      {showNameInput ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 bg-slate-700 border border-green-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveScore();
                            }}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={saveScore}
                              className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
                            >
                              Save Score
                            </button>
                            <button
                              onClick={() => setShowNameInput(false)}
                              className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                            >
                              Skip
                            </button>
                          </div>
                        </div>
                      ) : session?.user?.name ? (
                        <div className="space-y-4">
                          <p className="text-green-300">Playing as: {session.user.name}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={saveScore}
                              className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
                            >
                              Save Score
                            </button>
                            <button
                              onClick={startGame}
                              className="flex-1 px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-semibold"
                            >
                              Play Again
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={startGame}
                          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold text-lg"
                        >
                          Play Again
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-green-300 mb-2">Controls</h3>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Arrow Keys / WASD - Move</li>
                    <li>• SPACE - Pause/Resume</li>
                    <li>• ENTER - Start Game</li>
                  </ul>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-green-300 mb-2">Rules</h3>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Eat the red dots to grow</li>
                    <li>• Don&apos;t hit walls or yourself</li>
                    <li>• Each food = 10 points</li>
                  </ul>
                </div>
              </div>

              {gameStarted && !gameOver && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={togglePause}
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-semibold"
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/30 rounded-3xl p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>🏆</span>
                  Top Scores
                </h2>
                <button
                  onClick={fetchHighScores}
                  className="text-green-300 hover:text-green-100 transition-colors"
                  title="Refresh"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              {highScores.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-2">No scores yet!</p>
                  <p className="text-sm text-slate-500">Be the first to set a record!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {highScores.map((scoreEntry, index) => (
                    <div
                      key={scoreEntry.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        index === 0
                          ? 'bg-yellow-500/20 border border-yellow-500/30'
                          : index === 1
                          ? 'bg-slate-500/20 border border-slate-400/30'
                          : index === 2
                          ? 'bg-orange-500/20 border border-orange-500/30'
                          : 'bg-slate-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-white w-6">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                        </span>
                        <div>
                          <p className="text-white font-semibold">{scoreEntry.playerName}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(scoreEntry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-green-400">{scoreEntry.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
