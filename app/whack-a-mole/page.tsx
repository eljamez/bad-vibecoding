'use client';

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";

interface Mole {
  id: number;
  active: boolean;
  hit: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const GRID_SIZE = 9; // 3x3 grid
const GAME_DURATION = 30000; // 30 seconds

const DIFFICULTY_SETTINGS = {
  easy: { moleUpTime: 1200, spawnDelay: 900 },
  medium: { moleUpTime: 900, spawnDelay: 700 },
  hard: { moleUpTime: 700, spawnDelay: 500 },
};

export default function WhackAMolePage() {
  const [moles, setMoles] = useState<Mole[]>(
    Array.from({ length: GRID_SIZE }, (_, i) => ({ id: i, active: false, hit: false }))
  );
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [missed, setMissed] = useState(0);

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('whackAMoleHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const resetGame = useCallback(() => {
    setMoles(Array.from({ length: GRID_SIZE }, (_, i) => ({ id: i, active: false, hit: false })));
    setScore(0);
    setTimeLeft(GAME_DURATION / 1000);
    setGameStarted(false);
    setGameOver(false);
    setCombo(0);
    setMissed(0);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setGameStarted(true);
    setGameOver(false);
  }, [resetGame]);

  const endGame = useCallback(() => {
    setGameStarted(false);
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('whackAMoleHighScore', score.toString());
    }
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
  }, [score, highScore]);

  const spawnMole = useCallback(() => {
    if (!gameStarted || gameOver) return;

    const settings = DIFFICULTY_SETTINGS[difficulty];
    
    setMoles((prevMoles) => {
      // Get inactive moles
      const inactiveMoles = prevMoles.filter((m) => !m.active);
      if (inactiveMoles.length === 0) return prevMoles;

      // Pick a random inactive mole
      const randomMole = inactiveMoles[Math.floor(Math.random() * inactiveMoles.length)];
      
      const newMoles = prevMoles.map((m) =>
        m.id === randomMole.id ? { ...m, active: true, hit: false } : m
      );

      // Schedule mole to go down
      setTimeout(() => {
        setMoles((current) =>
          current.map((m) => {
            if (m.id === randomMole.id && m.active && !m.hit) {
              setMissed((prev) => prev + 1);
              setCombo(0);
              return { ...m, active: false };
            }
            return m;
          })
        );
      }, settings.moleUpTime);

      return newMoles;
    });

    // Schedule next mole spawn
    moleTimerRef.current = setTimeout(spawnMole, settings.spawnDelay);
  }, [gameStarted, gameOver, difficulty]);

  // Game timer
  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            endGame();
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);

      // Start spawning moles
      spawnMole();

      return () => {
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
      };
    }
  }, [gameStarted, gameOver, endGame, spawnMole]);

  const whackMole = (moleId: number) => {
    setMoles((prevMoles) =>
      prevMoles.map((m) => {
        if (m.id === moleId && m.active && !m.hit) {
          const comboMultiplier = Math.floor(combo / 3) + 1;
          setScore((prev) => prev + 10 * comboMultiplier);
          setCombo((prev) => prev + 1);
          return { ...m, hit: true, active: false };
        }
        return m;
      })
    );
  };

  const getAccuracy = () => {
    const total = score / 10 + missed;
    if (total === 0) return 0;
    return Math.round((score / 10 / total) * 100);
  };

  // Keyboard controls - Map keys to mole positions like a numpad
  // 7 8 9 (top row)    -> moles 0, 1, 2
  // 4 5 6 (middle row) -> moles 3, 4, 5
  // 1 2 3 (bottom row) -> moles 6, 7, 8
  const keyToMoleMap: { [key: string]: number } = {
    '7': 0, '8': 1, '9': 2,
    '4': 3, '5': 4, '6': 5,
    '1': 6, '2': 7, '3': 8,
  };

  const moleToKeyMap: { [id: number]: string } = {
    0: '7', 1: '8', 2: '9',
    3: '4', 4: '5', 5: '6',
    6: '1', 7: '2', 8: '3',
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;

      const moleId = keyToMoleMap[e.key];
      if (moleId !== undefined) {
        e.preventDefault();
        whackMole(moleId);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-orange-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center text-orange-300 hover:text-orange-100 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-orange-500/30 rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔨</div>
            <h1 className="text-4xl font-bold text-white mb-2">Whack-A-Mole</h1>
            <p className="text-slate-400">Test your reflexes!</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-orange-500/20 text-center">
              <div className="text-orange-400 text-sm mb-1">Score</div>
              <div className="text-white text-3xl font-bold">{score}</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-orange-500/20 text-center">
              <div className="text-orange-400 text-sm mb-1">Time</div>
              <div className="text-white text-3xl font-bold">{timeLeft.toFixed(1)}s</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-orange-500/20 text-center">
              <div className="text-orange-400 text-sm mb-1">Combo</div>
              <div className="text-white text-3xl font-bold">
                {combo > 0 ? `${combo}x` : '-'}
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-orange-500/20 text-center">
              <div className="text-orange-400 text-sm mb-1">High Score</div>
              <div className="text-white text-3xl font-bold">{highScore}</div>
            </div>
          </div>

          {/* Game Area */}
          {!gameStarted && !gameOver ? (
            <div className="text-center py-12">
              <p className="text-white text-xl mb-6">Select Difficulty</p>
              <div className="flex justify-center gap-4 mb-8">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                      difficulty === diff
                        ? 'bg-orange-500 text-white scale-110'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
              <button
                onClick={startGame}
                className="px-12 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all hover:scale-105 font-bold text-xl"
              >
                Start Game
              </button>
            </div>
          ) : gameOver ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {score > highScore - 10 ? '🏆' : '🎯'}
              </div>
              <p className="text-4xl text-white font-bold mb-2">Game Over!</p>
              <p className="text-2xl text-orange-300 mb-4">Final Score: {score}</p>
              <div className="bg-slate-700/50 rounded-xl p-6 mb-6 inline-block">
                <div className="text-slate-300 space-y-2">
                  <p>Accuracy: {getAccuracy()}%</p>
                  <p>Moles Whacked: {score / 10}</p>
                  <p>Moles Missed: {missed}</p>
                  {combo > 5 && <p className="text-orange-400">Best Combo: {combo}x</p>}
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-semibold"
                >
                  Play Again
                </button>
                <button
                  onClick={resetGame}
                  className="px-8 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-colors font-semibold"
                >
                  Change Difficulty
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Mole Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6 max-w-lg mx-auto">
                {moles.map((mole) => (
                  <button
                    key={mole.id}
                    onClick={() => whackMole(mole.id)}
                    disabled={!mole.active}
                    className="relative aspect-square bg-gradient-to-b from-amber-900 to-amber-950 rounded-2xl border-4 border-amber-800 overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
                  >
                    {/* Key indicator */}
                    <div className="absolute top-2 left-2 w-8 h-8 bg-slate-800/80 rounded-lg flex items-center justify-center border border-orange-500/30">
                      <span className="text-orange-300 font-bold text-lg">{moleToKeyMap[mole.id]}</span>
                    </div>
                    
                    {/* Hole */}
                    <div className="absolute inset-0 flex items-end justify-center">
                      <div className="w-20 h-16 bg-black/60 rounded-t-full mb-2" />
                    </div>
                    
                    {/* Mole */}
                    {mole.active && !mole.hit && (
                      <div className="absolute inset-0 flex items-end justify-center animate-bounce">
                        <div className="text-6xl mb-2 cursor-pointer transition-transform hover:scale-110">
                          🐹
                        </div>
                      </div>
                    )}
                    
                    {/* Hit effect */}
                    {mole.hit && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-5xl animate-ping">💥</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Combo indicator */}
              {combo >= 3 && (
                <div className="text-center mb-4">
                  <div className="inline-block bg-orange-500/20 border border-orange-500/50 rounded-xl px-6 py-2">
                    <span className="text-orange-300 font-bold text-xl">
                      🔥 {combo}x Combo! {Math.floor(combo / 3) > 1 && `${Math.floor(combo / 3)}x Points!`}
                    </span>
                  </div>
                </div>
              )}

              {/* Keyboard hint */}
              <div className="text-center mt-4">
                <p className="text-slate-500 text-sm">
                  ⌨️ Use keys 1-9 for faster reactions!
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!gameStarted && !gameOver && (
            <div className="bg-slate-700/50 rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">How to Play</h3>
              <ul className="space-y-2 text-slate-300 text-left max-w-md mx-auto">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span>Click on moles or use keyboard keys 1-9 (like a numpad)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span>Each hit scores 10 points (multiplied by combo!)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span>Build combos by hitting consecutive moles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span>You have 30 seconds - make every hit count!</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

