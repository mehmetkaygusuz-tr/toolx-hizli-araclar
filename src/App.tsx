import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './presentation/components/layout/Header';
import { CategoryBar } from './presentation/components/layout/CategoryBar';
import { ToolIconLauncher } from './presentation/components/layout/ToolIconLauncher';
import { RightToolsPanel } from './presentation/components/layout/RightToolsPanel';
import { Footer } from './presentation/components/layout/Footer';
import { ToolCategory, TOOLS, ToolItem } from './application/registry/toolsRegistry';
import { useLocalStorage } from './application/hooks/useLocalStorage';
import { SearchX, Pin, ArrowLeft, PanelRightOpen } from 'lucide-react';

// Tool Components
import { ImageCompressorTool } from './presentation/components/tools/ImageCompressorTool';
import { ColorPaletteTool } from './presentation/components/tools/ColorPaletteTool';
import { VatCalculatorTool } from './presentation/components/tools/VatCalculatorTool';
import { DiscountCalculatorTool } from './presentation/components/tools/DiscountCalculatorTool';
import { PercentageCalculatorTool } from './presentation/components/tools/PercentageCalculatorTool';
import { BmiCalculatorTool } from './presentation/components/tools/BmiCalculatorTool';
import { BillSplitTool } from './presentation/components/tools/BillSplitTool';
import { TextCounterTool } from './presentation/components/tools/TextCounterTool';
import { TurkishCaseConverterTool } from './presentation/components/tools/TurkishCaseConverterTool';
import { TextCleanerDiffTool } from './presentation/components/tools/TextCleanerDiffTool';
import { DateDifferenceTool } from './presentation/components/tools/DateDifferenceTool';
import { AgeZodiacTool } from './presentation/components/tools/AgeZodiacTool';
import { StopwatchTimerTool } from './presentation/components/tools/StopwatchTimerTool';
import { WorldClockTool } from './presentation/components/tools/WorldClockTool';
import { UnitConverterTool } from './presentation/components/tools/UnitConverterTool';
import { TemperatureConverterTool } from './presentation/components/tools/TemperatureConverterTool';
import { QrCodeGeneratorTool } from './presentation/components/tools/QrCodeGeneratorTool';
import { PasswordPinGeneratorTool } from './presentation/components/tools/PasswordPinGeneratorTool';
import { RandomPickerTool } from './presentation/components/tools/RandomPickerTool';
import { SignaturePadTool } from './presentation/components/tools/SignaturePadTool';
import { QuickScratchpadTool } from './presentation/components/tools/QuickScratchpadTool';

const TOOL_COMPONENTS_MAP: Record<string, React.FC> = {
  'gorsel-sikistir': ImageCompressorTool,
  'renk-paleti': ColorPaletteTool,
  'kdv-hesaplama': VatCalculatorTool,
  'indirim-kar': DiscountCalculatorTool,
  'yuzde-hesaplama': PercentageCalculatorTool,
  'vki-hesaplama': BmiCalculatorTool,
  'hesap-bolusturucu': BillSplitTool,
  'kelime-sayaci': TextCounterTool,
  'turkce-harf-donusturucu': TurkishCaseConverterTool,
  'metin-temizleyici': TextCleanerDiffTool,
  'tarih-farki': DateDifferenceTool,
  'yas-burc': AgeZodiacTool,
  'kronometre-sayac': StopwatchTimerTool,
  'dunya-saatleri': WorldClockTool,
  'birim-donusturucu': UnitConverterTool,
  'sicaklik-donusturucu': TemperatureConverterTool,
  'qr-kod-olusturucu': QrCodeGeneratorTool,
  'guclu-parola': PasswordPinGeneratorTool,
  'rastgele-secici': RandomPickerTool,
  'dijital-imza': SignaturePadTool,
  'hizli-not': QuickScratchpadTool,
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Default strictly to null (Home page with app icons on initial load)
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(false);

  const [pinnedToolIds, setPinnedToolIds] = useLocalStorage<string[]>('toolx_pinned_tools', [
    'gorsel-sikistir',
    'kdv-hesaplama',
  ]);

  // Clean initial load: if there was a leftover hash on refresh, clean it so home page opens first
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const openTool = useCallback((tool: ToolItem) => {
    setSelectedTool(tool);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.replaceState(null, '', `#${tool.id}`);
  }, []);

  const goHome = useCallback(() => {
    setSelectedTool(null);
    setIsRightPanelOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<ToolCategory, number> = {
      all: TOOLS.length,
      image: 0,
      math: 0,
      text: 0,
      datetime: 0,
      units: 0,
      practical: 0,
    };
    TOOLS.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      if (activeCategory !== 'all' && tool.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.shortDesc.toLowerCase().includes(q) ||
          tool.keywords.some((k) => k.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Toggle tool pin
  const togglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPinnedToolIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const SelectedToolComponent = selectedTool ? TOOL_COMPONENTS_MAP[selectedTool.id] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-blue-600 selection:text-white relative">
      {/* Top Header Navbar: Logo mark only on left, search bar in center */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onGoHome={goHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-12">
        {selectedTool ? (
          /* ACTIVE TOOL PAGE VIEW */
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Simple Clean Tool Navigation Bar (No redundant buttons) */}
            <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={goHome}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-blue-400" />
                <span>Tüm Araçlar</span>
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-bold text-white truncate">
                {selectedTool.name}
              </span>
            </div>

            {/* Selected Tool Interactive Component */}
            <div className="w-full">
              {SelectedToolComponent && <SelectedToolComponent />}
            </div>
          </div>
        ) : (
          /* HOME MODE: PURE APP LAUNCHER ICONS (No marketing text) */
          <div>
            {/* Category Filter Bar */}
            <div className="py-1 mb-6">
              <CategoryBar
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                categoryCounts={categoryCounts}
              />
            </div>

            {/* Pinned Tools Row (Only when category is 'all' and search is empty) */}
            {pinnedToolIds.length > 0 && searchQuery === '' && activeCategory === 'all' && (
              <div className="mb-6 p-3 bg-slate-900/40 rounded-2xl border border-slate-800/80">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  <Pin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sabitlenen Araçlar</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pinnedToolIds.map((id) => {
                    const tool = TOOLS.find((t) => t.id === id);
                    if (!tool) return null;
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => openTool(tool)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-blue-500/50 rounded-xl transition-all cursor-pointer"
                      >
                        <span>{tool.name}</span>
                        <span
                          onClick={(e) => togglePin(tool.id, e)}
                          title="Sabitlemeyi kaldır"
                          className="text-slate-400 hover:text-rose-400 text-xs ml-1"
                        >
                          ×
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* App Icons Launcher Grid (Pure icons, expanding card on hover) */}
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-y-12 gap-x-6 sm:gap-x-10 justify-items-center py-8">
                {filteredTools.map((tool) => (
                  <ToolIconLauncher
                    key={tool.id}
                    tool={tool}
                    isPinned={pinnedToolIds.includes(tool.id)}
                    onSelect={openTool}
                    onTogglePin={togglePin}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search State */
              <div className="py-20 text-center space-y-3 bg-slate-900/30 rounded-2xl border border-slate-800 my-8">
                <SearchX className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-semibold text-white">Aradığınız araç bulunamadı</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  &quot;{searchQuery}&quot; sorgusuna uygun araç mevcut değil.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
                >
                  Tüm Araçları Göster
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Right Edge Drawer Button (Always visible on home and tool pages) */}
      <button
        type="button"
        onClick={() => setIsRightPanelOpen((prev) => !prev)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-2 rounded-l-2xl shadow-2xl flex flex-col items-center gap-2 border-y border-l border-blue-400/40 transition-transform hover:-translate-x-1 cursor-pointer"
        title="Araçlar Panelini Aç/Kapat"
      >
        <PanelRightOpen className="w-4 h-4" />
        <span className="text-[10px] font-bold tracking-widest uppercase [writing-mode:vertical-lr]">
          Araçlar
        </span>
      </button>

      {/* Right Tools Switcher Drawer Panel */}
      <RightToolsPanel
        isOpen={isRightPanelOpen}
        onClose={() => setIsRightPanelOpen(false)}
        activeToolId={selectedTool ? selectedTool.id : null}
        onSelectTool={(tool) => {
          openTool(tool);
          setIsRightPanelOpen(false);
        }}
        pinnedToolIds={pinnedToolIds}
        onTogglePin={togglePin}
        variant="drawer"
      />

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}
