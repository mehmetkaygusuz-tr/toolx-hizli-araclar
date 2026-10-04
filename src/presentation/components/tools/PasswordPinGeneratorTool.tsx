import React, { useState } from 'react';
import { KeyRound, RefreshCw, Shield, Check } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import {
  generatePassword,
  evaluatePasswordStrength,
  PasswordGeneratorOptions,
} from '../../../domain/practical/passwordGenerator';
import { CopyButton } from '../common/CopyButton';

export const PasswordPinGeneratorTool: React.FC = () => {
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(true);
  const [mode, setMode] = useState<'random' | 'pin' | 'readable'>('random');

  const [password, setPassword] = useState<string>(() =>
    generatePassword({
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: true,
      mode: 'random',
    })
  );

  const handleRegenerate = () => {
    const newPwd = generatePassword({
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeSimilar,
      mode,
    });
    setPassword(newPwd);
  };

  const strength = evaluatePasswordStrength(password);

  return (
    <ToolCard
      id="guclu-parola"
      title="Güçlü Şifre & PIN Oluşturucu"
      description="Hesaplarınız için kırılması imkansız şifreler, kolay akılda kalan kelimeler veya 4-6 haneli banka PIN kodları oluşturun."
      icon={KeyRound}
      categoryLabel="Pratik Günlük"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-6 space-y-4 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800">
            {[
              { id: 'random', label: 'Güçlü Rastgele' },
              { id: 'readable', label: 'Akılda Kalıcı' },
              { id: 'pin', label: 'Banka PIN' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMode(m.id as typeof mode);
                  if (m.id === 'pin') setLength(6);
                  else if (m.id === 'readable') setLength(14);
                  else setLength(16);
                }}
                className={`py-2 px-2 text-xs font-medium rounded-lg transition-all ${
                  mode === m.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Length Slider */}
          {mode !== 'readable' && (
            <div>
              <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5">
                <span>{mode === 'pin' ? 'PIN Hane Sayısı' : 'Şifre Uzunluğu'}</span>
                <span className="font-mono text-blue-400 font-bold">{length} Karakter</span>
              </div>
              <input
                type="range"
                min={mode === 'pin' ? 4 : 8}
                max={mode === 'pin' ? 12 : 36}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          )}

          {/* Character Options (only in random mode) */}
          {mode === 'random' && (
            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
                />
                <span>Büyük Harfler (A-Z)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
                />
                <span>Küçük Harfler (a-z)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
                />
                <span>Rakamlar (0-9)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
                />
                <span>Özel Semboller (!@#$%)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                <input
                  type="checkbox"
                  checked={excludeSimilar}
                  onChange={(e) => setExcludeSimilar(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
                />
                <span>Karışan Harfleri Hariç Tut (i, l, 1, 0, O)</span>
              </label>
            </div>
          )}
        </div>

        {/* Output & Strength Indicator */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-800/40 p-5 rounded-xl border border-slate-800 space-y-4">
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Oluşturulan Parola
            </span>

            {/* Password Display Box */}
            <div className="relative p-4 bg-slate-900 rounded-xl border border-slate-700/80 flex items-center justify-between">
              <span className="text-lg md:text-xl font-mono font-bold text-white tracking-wider break-all select-all">
                {password}
              </span>
              <button
                type="button"
                onClick={handleRegenerate}
                className="p-2 ml-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
                title="Yenisini Üret"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Strength Meter */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Güvenlik Seviyesi:</span>
                <span className="font-semibold font-mono" style={{ color: strength.color }}>
                  {strength.labelTr}
                </span>
              </div>
              <div className="flex gap-1.5 h-1.5 w-full">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div
                    key={lvl}
                    className="flex-1 rounded-full transition-colors"
                    style={{
                      backgroundColor: lvl <= strength.score ? strength.color : '#334155',
                    }}
                  />
                ))}
              </div>
              <span className="block text-[11px] text-slate-500">
                Kırılma süresi tahmini: <span className="text-slate-300 font-medium">{strength.crackTimeEstimateTr}</span>
              </span>
            </div>
          </div>

          <div className="pt-2">
            <CopyButton text={password} label="Parolayı Kopyala" className="w-full py-3 text-sm font-semibold" />
          </div>
        </div>
      </div>
    </ToolCard>
  );
};
