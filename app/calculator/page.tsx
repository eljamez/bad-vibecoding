'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function CalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      
      if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperation(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand]);

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(String(inputValue));
    } else if (operation) {
      const currentValue = previousValue || '0';
      const newValue = performCalculation(parseFloat(currentValue), inputValue, operation);
      
      setDisplay(String(newValue));
      setPreviousValue(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const performCalculation = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const currentValue = parseFloat(previousValue);
      const newValue = performCalculation(currentValue, inputValue, operation);
      
      // Add to history
      const calculation = `${previousValue} ${operation === '*' ? '×' : operation === '/' ? '÷' : operation} ${display} = ${newValue}`;
      setHistory([calculation, ...history].slice(0, 5));
      
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const Button = ({ value, onClick, className = '', colspan = false }: { 
    value: string; 
    onClick: () => void; 
    className?: string;
    colspan?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`${colspan ? 'col-span-2' : ''} px-6 py-5 text-2xl font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 ${className}`}
    >
      {value}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-800 to-teal-900 flex items-start justify-center p-4 pt-8">
      <div className="max-w-2xl w-full">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center text-teal-300 hover:text-teal-100 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-teal-500/30 rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔢</div>
            <h1 className="text-4xl font-bold text-white mb-2">Calculator</h1>
            <p className="text-slate-400">Crunch numbers with style</p>
          </div>

          {/* Display */}
          <div className="mb-6 bg-slate-900/50 rounded-xl p-6 border border-teal-500/20">
            <div className="text-right">
              {previousValue && operation && (
                <div className="text-teal-400 text-lg mb-2">
                  {previousValue} {operation === '*' ? '×' : operation === '/' ? '÷' : operation}
                </div>
              )}
              <div className="text-white text-5xl font-bold break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Calculator Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <Button value="C" onClick={handleClear} className="bg-red-500/80 hover:bg-red-500 text-white" />
            <Button value="⌫" onClick={handleBackspace} className="bg-slate-700/80 hover:bg-slate-600 text-white" />
            <Button value="÷" onClick={() => handleOperation('/')} className="bg-teal-600/80 hover:bg-teal-500 text-white" />
            <Button value="×" onClick={() => handleOperation('*')} className="bg-teal-600/80 hover:bg-teal-500 text-white" />
            
            <Button value="7" onClick={() => handleNumber('7')} className="bg-slate-700/50 hover:bg-slate-600 text-white" />
            <Button value="8" onClick={() => handleNumber('8')} className="bg-slate-700/50 hover:bg-slate-600 text-white" />
            <Button value="9" onClick={() => handleNumber('9')} className="bg-slate-700/50 hover:bg-slate-600 text-white" />
            <Button value="-" onClick={() => handleOperation('-')} className="bg-teal-600/80 hover:bg-teal-500 text-white" />
            
            <Button value="4" onClick={() => handleNumber('4')} className="bg-slate-700/50 hover:bg-slate-600 text-white" />
            <Button value="5" onClick={() => handleNumber('5')} className="bg-slate-700/50 hover:bg-slate-600 text-white" />
            <Button value="6" onClick={() => handleNumber('6')} className="bg-slate-700/50 hover:bg-slate-600 text-white" />
            <Button value="+" onClick={() => handleOperation('+')} className="bg-teal-600/80 hover:bg-teal-500 text-white" />
            
            <Button value="1" onClick={() => handleNumber('1')} className="bg-slate-700/50 hover:bg-slate-600 text-white" />
            <Button value="2" onClick={() => handleNumber('2')} className="bg-slate-700/50 hover:bg-slate-600 text-white" />
            <Button value="3" onClick={() => handleNumber('3')} className="bg-slate-700/50 hover:bg-slate-600 text-white" />
            <Button value="=" onClick={handleEquals} className="bg-teal-500 hover:bg-teal-400 text-white row-span-2" />
            
            <Button value="0" onClick={() => handleNumber('0')} className="bg-slate-700/50 hover:bg-slate-600 text-white" colspan />
            <Button value="." onClick={handleDecimal} className="bg-slate-700/50 hover:bg-slate-600 text-white" />
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-slate-900/30 rounded-xl p-4 border border-teal-500/20">
              <h3 className="text-teal-400 font-semibold mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
              </h3>
              <div className="space-y-2">
                {history.map((calc, index) => (
                  <div key={index} className="text-slate-300 text-sm font-mono">
                    {calc}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keyboard Hint */}
          <div className="mt-6 text-center text-slate-500 text-sm">
            💡 Keyboard supported: Numbers, operators, Enter (=), Escape (C), Backspace
          </div>
        </div>
      </div>
    </div>
  );
}

