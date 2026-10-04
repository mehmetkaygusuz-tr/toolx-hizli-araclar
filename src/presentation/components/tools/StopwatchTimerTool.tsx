import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Flag, Bell } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { useSound } from '../../../application/hooks/useSound';

export const StopwatchTimerTool: React.FC = () => {
  const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');
  const { playSuccess, playPop } = useSound();

  // Stopwatch state
  const [swTimeMs, setSwTimeMs] = useState<number>(0);
  const [swRunning, setSwRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swIntervalRef = useRef<number | null>(null);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 min
  const [timerInitial, setTimerInitial] = useState<number>(300);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<number | null>(null);

  // Stopwatch effect
  useEffect(() => {
    if (swRunning) {
      const start = Date.now() - swTimeMs;
      swIntervalRef.current = window.setInterval(() => {
        setSwTimeMs(Date.now() - start);
      }, 10);
    } else if (swIntervalRef.current) {
      clearInterval(swIntervalRef.current);
    }
    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    };
  }, [swRunning]);

  // Timer effect
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setTimerRunning(false);
            playSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerRunning, timerSeconds, playSuccess]);

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAddLap = () => {
    playPop();
    setLaps((prev) => [swTimeMs, ...prev]);
  };

  const handleResetStopwatch = () => {
    setSwRunning(false);
    setSwTimeMs(0);
    setLaps([]);
  };

  const setTimerPreset = (secs: number) => {
    setTimerRunning(false);
    setTimerInitial(secs);
    setTimerSeconds(secs);
  };

  return (
    <ToolCard
      id="kronometre-sayac"
      title="Kronometre & Geri Sayım Sayacı"
      description="Milisaniye hassasiyetli tur zamanlı kronometre ve çalışma/odaklanma için sesli alarmlı geri sayım sayacı."
      icon={Timer}
      categoryLabel="Tarih & Zaman"
    >
      <div className="space-y-5">
        <div className="flex gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => setMode('stopwatch')}
            className={`py-1.5 px-4 text-xs font-medium rounded-lg transition-all ${
              mode === 'stopwatch' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kronometre
          </button>
          <button
            onClick={() => setMode('timer')}
            className={`py-1.5 px-4 text-xs font-medium rounded-lg transition-all ${
              mode === 'timer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Geri Sayım Zamanlayıcı
          </button>
        </div>

        {mode === 'stopwatch' ? (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-800/40 rounded-xl border border-slate-800 space-y-6">
            {/* Big Digits */}
            <div className="text-5xl md:text-7xl font-extrabold text-white font-mono tracking-wider tabular-nums">
              {formatStopwatch(swTimeMs)}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSwRunning(!swRunning)}
                className={`py-3 px-6 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                  swRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                }`}
              >
                {swRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Durdur</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Başlat</span>
                  </>
                )}
              </button>

              {swRunning && (
                <button
                  type="button"
                  onClick={handleAddLap}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-medium flex items-center gap-1.5"
                >
                  <Flag className="w-4 h-4 text-blue-400" />
                  <span>Tur / Lap</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetStopwatch}
                className="py-3 px-4 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 rounded-xl text-sm transition-colors"
                title="Sıfırla"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Laps List */}
            {laps.length > 0 && (
              <div className="w-full max-w-md pt-4 border-t border-slate-800 max-h-48 overflow-y-auto space-y-1">
                {laps.map((lapMs, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 px-3 bg-slate-900/60 rounded-lg text-xs font-mono"
                  >
                    <span className="text-slate-500">Tur {laps.length - idx}</span>
                    <span className="text-white font-semibold">{formatStopwatch(lapMs)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-800/40 rounded-xl border border-slate-800 space-y-6">
            {/* Timer Presets */}
            <div className="flex flex-wrap gap-2">
              {[
                { sec: 60, label: '1 Dakika' },
                { sec: 300, label: '5 Dakika' },
                { sec: 600, label: '10 Dakika' },
                { sec: 900, label: '15 Dakika' },
                { sec: 1500, label: '25 Dk (Pomodoro)' },
              ].map((p) => (
                <button
                  key={p.sec}
                  type="button"
                  onClick={() => setTimerPreset(p.sec)}
                  className={`py-1.5 px-3 text-xs rounded-lg border transition-colors ${
                    timerInitial === p.sec
                      ? 'bg-blue-600/30 text-blue-400 border-blue-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Digits */}
            <div
              className={`text-6xl md:text-8xl font-black font-mono tracking-wider tabular-nums ${
                timerSeconds === 0 ? 'text-rose-500 animate-pulse' : 'text-white'
              }`}
            >
              {formatTimer(timerSeconds)}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTimerRunning(!timerRunning)}
                className={`py-3 px-6 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                  timerRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                }`}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Durdur</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{timerSeconds === 0 ? 'Yeniden Başlat' : 'Başlat'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(timerInitial);
                }}
                className="py-3 px-4 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 rounded-xl text-sm transition-colors"
                title="Sıfırla"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
};
