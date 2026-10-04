import React, { useState } from 'react';
import { Shuffle, Coins, Dices, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolCard } from '../common/ToolCard';
import { pickRandomItem, flipCoin, rollDice } from '../../../domain/practical/randomPicker';
import { useSound } from '../../../application/hooks/useSound';

export const RandomPickerTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'picker' | 'coin' | 'dice'>('picker');
  const { playSuccess, playPop } = useSound();

  // Picker state
  const [itemsText, setItemsText] = useState<string>('Ali\nAyşe\nMehmet\nZeynep\nBurak\nElif');
  const [winner, setWinner] = useState<string | null>(null);

  // Coin state
  const [coinResult, setCoinResult] = useState<'Yazı' | 'Tura' | null>(null);
  const [flipping, setFlipping] = useState<boolean>(false);

  // Dice state
  const [diceCount, setDiceCount] = useState<number>(2);
  const [diceResults, setDiceResults] = useState<number[]>([4, 6]);

  const handlePickWinner = () => {
    const items = itemsText
      .split('\n')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (items.length === 0) return;

    playSuccess();
    const picked = pickRandomItem(items);
    setWinner(picked);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if confetti fails
    }
  };

  const handleFlipCoin = () => {
    playPop();
    setFlipping(true);
    setTimeout(() => {
      setCoinResult(flipCoin());
      setFlipping(false);
      playSuccess();
    }, 400);
  };

  const handleRollDice = () => {
    playPop();
    const rolls = rollDice(6, diceCount);
    setDiceResults(rolls);
    playSuccess();
  };

  return (
    <ToolCard
      id="rastgele-secici"
      title="Rastgele Karar Verici, Çekiliş & Zar"
      description="Kararsız kaldığınızda liste içinden kura çekin, havaya yazı-tura atın veya oyunlarınız için zar yuvarlayın."
      icon={Shuffle}
      categoryLabel="Pratik Günlük"
    >
      <div className="space-y-5">
        {/* Subtabs */}
        <div className="flex gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab('picker')}
            className={`py-1.5 px-3.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'picker' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Kura / İsim Seçici</span>
          </button>
          <button
            onClick={() => setActiveTab('coin')}
            className={`py-1.5 px-3.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'coin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Yazı - Tura</span>
          </button>
          <button
            onClick={() => setActiveTab('dice')}
            className={`py-1.5 px-3.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'dice' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Zar Atma</span>
          </button>
        </div>

        {activeTab === 'picker' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-3 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
              <label className="block text-xs font-medium text-slate-300">
                Seçenekler veya İsimler (Her satıra bir tane)
              </label>
              <textarea
                rows={6}
                value={itemsText}
                onChange={(e) => setItemsText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
              />
              <button
                type="button"
                onClick={handlePickWinner}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                <span>Rastgele Seç (Kura Çek)</span>
              </button>
            </div>

            <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-800/40 rounded-xl border border-slate-800 min-h-[220px]">
              {winner ? (
                <div className="text-center space-y-2 animate-bounce">
                  <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Kazanan Seçenek
                  </span>
                  <span className="block text-3xl font-extrabold text-white">{winner}</span>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs">
                  Listeyi doldurun ve &apos;Rastgele Seç&apos; butonuna basın.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'coin' && (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-800/40 rounded-xl border border-slate-800 space-y-6">
            <div
              className={`w-32 h-32 rounded-full border-4 border-amber-500/60 bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-xl transition-transform duration-300 ${
                flipping ? 'animate-spin scale-90' : 'hover:scale-105'
              }`}
            >
              <span className="text-2xl font-black text-slate-950 uppercase tracking-widest">
                {coinResult || 'Para'}
              </span>
            </div>

            <button
              type="button"
              disabled={flipping}
              onClick={handleFlipCoin}
              className="py-3 px-6 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-amber-600/20 flex items-center gap-2"
            >
              <Coins className="w-4 h-4" />
              <span>Havaya At (Yazı-Tura)</span>
            </button>
          </div>
        )}

        {activeTab === 'dice' && (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-800/40 rounded-xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300">Zar Sayısı:</span>
              <button
                type="button"
                onClick={() => setDiceCount(1)}
                className={`py-1 px-3 text-xs rounded border ${
                  diceCount === 1 ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                1 Zar
              </button>
              <button
                type="button"
                onClick={() => setDiceCount(2)}
                className={`py-1 px-3 text-xs rounded border ${
                  diceCount === 2 ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                2 Zar
              </button>
            </div>

            <div className="flex items-center gap-4">
              {diceResults.slice(0, diceCount).map((val, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 bg-slate-900 rounded-2xl border-2 border-slate-600 flex items-center justify-center text-4xl font-extrabold text-white shadow-xl font-mono"
                >
                  {val}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleRollDice}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <Dices className="w-4 h-4" />
              <span>Zarları Yuvarla</span>
            </button>
          </div>
        )}
      </div>
    </ToolCard>
  );
};
