import React, { useState, useMemo, useEffect, useCallback, Suspense, lazy } from 'react';
import { Header } from './presentation/components/layout/Header';
import { CategoryBar } from './presentation/components/layout/CategoryBar';
import { ToolIconLauncher } from './presentation/components/layout/ToolIconLauncher';
import { RightToolsPanel } from './presentation/components/layout/RightToolsPanel';
import { Footer } from './presentation/components/layout/Footer';
import { ToolCategory, TOOLS, ToolItem } from './application/registry/toolsRegistry';
import { useLocalStorage } from './application/hooks/useLocalStorage';
import { SearchX, Pin, ArrowLeft, PanelRightOpen, Loader2 } from 'lucide-react';

// Lazy-loaded Tool Components for high-performance Core Web Vitals (on-demand chunking)
const TOOL_COMPONENTS_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'gorsel-sikistir': lazy(() => import('./presentation/components/tools/ImageCompressorTool').then((m) => ({ default: m.ImageCompressorTool }))),
  'renk-paleti': lazy(() => import('./presentation/components/tools/ColorPaletteTool').then((m) => ({ default: m.ColorPaletteTool }))),
  'kdv-hesaplama': lazy(() => import('./presentation/components/tools/VatCalculatorTool').then((m) => ({ default: m.VatCalculatorTool }))),
  'indirim-kar': lazy(() => import('./presentation/components/tools/DiscountCalculatorTool').then((m) => ({ default: m.DiscountCalculatorTool }))),
  'yuzde-hesaplama': lazy(() => import('./presentation/components/tools/PercentageCalculatorTool').then((m) => ({ default: m.PercentageCalculatorTool }))),
  'vki-hesaplama': lazy(() => import('./presentation/components/tools/BmiCalculatorTool').then((m) => ({ default: m.BmiCalculatorTool }))),
  'hesap-bolusturucu': lazy(() => import('./presentation/components/tools/BillSplitTool').then((m) => ({ default: m.BillSplitTool }))),
  'kelime-sayaci': lazy(() => import('./presentation/components/tools/TextCounterTool').then((m) => ({ default: m.TextCounterTool }))),
  'turkce-harf-donusturucu': lazy(() => import('./presentation/components/tools/TurkishCaseConverterTool').then((m) => ({ default: m.TurkishCaseConverterTool }))),
  'metin-temizleyici': lazy(() => import('./presentation/components/tools/TextCleanerDiffTool').then((m) => ({ default: m.TextCleanerDiffTool }))),
  'tarih-farki': lazy(() => import('./presentation/components/tools/DateDifferenceTool').then((m) => ({ default: m.DateDifferenceTool }))),
  'yas-burc': lazy(() => import('./presentation/components/tools/AgeZodiacTool').then((m) => ({ default: m.AgeZodiacTool }))),
  'kronometre-sayac': lazy(() => import('./presentation/components/tools/StopwatchTimerTool').then((m) => ({ default: m.StopwatchTimerTool }))),
  'dunya-saatleri': lazy(() => import('./presentation/components/tools/WorldClockTool').then((m) => ({ default: m.WorldClockTool }))),
  'birim-donusturucu': lazy(() => import('./presentation/components/tools/UnitConverterTool').then((m) => ({ default: m.UnitConverterTool }))),
  'sicaklik-donusturucu': lazy(() => import('./presentation/components/tools/TemperatureConverterTool').then((m) => ({ default: m.TemperatureConverterTool }))),
  'qr-kod-olusturucu': lazy(() => import('./presentation/components/tools/QrCodeGeneratorTool').then((m) => ({ default: m.QrCodeGeneratorTool }))),
  'guclu-parola': lazy(() => import('./presentation/components/tools/PasswordPinGeneratorTool').then((m) => ({ default: m.PasswordPinGeneratorTool }))),
  'rastgele-secici': lazy(() => import('./presentation/components/tools/RandomPickerTool').then((m) => ({ default: m.RandomPickerTool }))),
  'dijital-imza': lazy(() => import('./presentation/components/tools/SignaturePadTool').then((m) => ({ default: m.SignaturePadTool }))),
  'hizli-not': lazy(() => import('./presentation/components/tools/QuickScratchpadTool').then((m) => ({ default: m.QuickScratchpadTool }))),
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');

  // Default strictly to null (Home page with app icons on initial load)
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState<boolean>(false);

  const [pinnedToolIds, setPinnedToolIds] = useLocalStorage<string[]>('toolx_pinned_tools', []);

  // Ensure default does not force pre-pinned tools (user will add their own favorites)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('toolx_pinned_tools');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          Array.isArray(parsed) &&
          parsed.length === 2 &&
          parsed.includes('gorsel-sikistir') &&
          parsed.includes('kdv-hesaplama')
        ) {
          setPinnedToolIds([]);
          localStorage.setItem('toolx_pinned_tools', JSON.stringify([]));
        }
      }
    } catch {
      // ignore
    }
  }, [setPinnedToolIds]);

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
    setIsToolsPanelOpen(false);
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

  // Filter tools based on active category
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      if (activeCategory !== 'all' && tool.category !== activeCategory) {
        return false;
      }
      return true;
    });
  }, [activeCategory]);

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
      {/* Top Header Navbar: Logo on left, standalone search bar with dropdown in center */}
      <Header
        onGoHome={goHome}
        onSelectTool={openTool}
      />

      {/* Main Container below Header: Spans full width edge-to-edge */}
      <div className="flex-1 w-full flex items-start relative">
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-4 pb-12 transition-all duration-200">
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

            {/* Selected Tool Interactive Component (Loaded on demand) */}
            <div className="w-full">
              {SelectedToolComponent && (
                <Suspense
                  fallback={
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                      <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
                      <p className="text-xs text-slate-400">Araç yükleniyor...</p>
                    </div>
                  }
                >
                  <SelectedToolComponent />
                </Suspense>
              )}
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

            {/* Pinned Tools Row (Only when category is 'all') */}
            {pinnedToolIds.length > 0 && activeCategory === 'all' && (
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
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-y-12 gap-x-6 sm:gap-x-10 justify-items-center py-8 pr-4 sm:pr-8">
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
              /* Empty Category State */
              <div className="py-20 text-center space-y-3 bg-slate-900/30 rounded-2xl border border-slate-800 my-8">
                <SearchX className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-semibold text-white">Bu kategoride araç bulunamadı</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Seçtiğiniz kategoriye ait araç bulunmuyor.
                </p>
                <button
                  type="button"
                  onClick={() => {
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

        {/* Desktop Docked Sidebar (lg+): FLUSH TO THE RIGHT EDGE, connects under header, 0px margin */}
        {isToolsPanelOpen && (
          <aside className="hidden lg:flex w-72 sm:w-80 shrink-0 sticky top-16 h-[calc(100vh-4rem)] bg-[#090d16] flex-col z-20 animate-in fade-in slide-in-from-right-2 duration-150">
            <RightToolsPanel
              isOpen={true}
              onClose={() => setIsToolsPanelOpen(false)}
              activeToolId={selectedTool ? selectedTool.id : null}
              onSelectTool={(tool) => openTool(tool)}
              pinnedToolIds={pinnedToolIds}
              onTogglePin={togglePin}
              variant="sidebar"
            />
          </aside>
        )}
      </div>

      {/* Floating Right Edge Drawer Button (Always visible on mobile, visible on desktop when sidebar is closed) */}
      <button
        type="button"
        onClick={() => setIsToolsPanelOpen((prev) => !prev)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-blue-600 hover:bg-blue-500 text-white py-3 px-1.5 rounded-l-xl shadow-2xl flex flex-col items-center gap-1.5 border-y border-l border-blue-400/40 transition-all hover:-translate-x-0.5 cursor-pointer group ${
          isToolsPanelOpen ? 'lg:hidden' : 'flex'
        }`}
        title={isToolsPanelOpen ? 'Menüyü Kapat' : 'Hızlı Menüyü Aç'}
        aria-label="Hızlı Araçlar Menüsünü Aç/Kapat"
      >
        <PanelRightOpen className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        <span className="text-[9px] font-bold tracking-widest uppercase [writing-mode:vertical-lr]">
          Araçlar
        </span>
      </button>

      {/* Mobile Drawer (Only on screens < lg so it doesn't crush the mobile screen) */}
      <div className="lg:hidden">
        <RightToolsPanel
          isOpen={isToolsPanelOpen}
          onClose={() => setIsToolsPanelOpen(false)}
          activeToolId={selectedTool ? selectedTool.id : null}
          onSelectTool={(tool) => openTool(tool)}
          pinnedToolIds={pinnedToolIds}
          onTogglePin={togglePin}
          variant="drawer"
        />
      </div>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}
