import React, { useState, useRef } from 'react';
import { Palette, Pipette, Upload, Check, Copy } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';
import { useClipboard } from '../../../application/hooks/useClipboard';

export const ColorPaletteTool: React.FC = () => {
  const [currentColor, setCurrentColor] = useState<string>('#0070F3');
  const [extractedPalette, setExtractedPalette] = useState<string[]>([
    '#0070F3', '#00DFD8', '#7928CA', '#FF0080', '#F5A623', '#50E3C2'
  ]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copy } = useClipboard();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgb = hexToRgb(currentColor);
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  // Extract colors from uploaded image
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const imgData = ctx.getImageData(0, 0, 100, 100).data;
      const colorCounts: Record<string, number> = {};

      // Sample every 4th pixel
      for (let i = 0; i < imgData.length; i += 16) {
        const r = Math.round(imgData[i] / 16) * 16;
        const g = Math.round(imgData[i + 1] / 16) * 16;
        const b = Math.round(imgData[i + 2] / 16) * 16;
        const a = imgData[i + 3];

        if (a > 128) {
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }
      }

      // Sort by frequency and pick 6 distinct
      const sorted = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
      const palette = sorted.slice(0, 6);
      if (palette.length > 0) {
        setExtractedPalette(palette);
        setCurrentColor(palette[0]);
      }
    };
  };

  // EyeDropper API
  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          setCurrentColor(result.sRGBHex.toUpperCase());
        }
      } catch {
        // User canceled eye dropper
      }
    }
  };

  const handleCopy = (color: string) => {
    copy(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  return (
    <ToolCard
      id="renk-paleti"
      title="Renk Seçici & Palet Çıkarıcı"
      description="Fotoğraflarınızdan renk paletleri yakalayın, damlalıkla ekrandan renk seçin ve renk kodlarını tek dokunuşla kopyalayın."
      icon={Palette}
      categoryLabel="Görsel & Medya"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Color Picker & Values */}
        <div className="lg:col-span-6 space-y-5 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Renk Seçimi</span>
            {'EyeDropper' in (typeof window !== 'undefined' ? window : {}) && (
              <button
                type="button"
                onClick={handleEyeDropper}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors"
              >
                <Pipette className="w-3.5 h-3.5" />
                <span>Damlalıkla Seç</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-inner border-2 border-slate-700 shrink-0">
              <input
                type="color"
                value={currentColor.startsWith('#') ? currentColor : '#0070F3'}
                onChange={(e) => setCurrentColor(e.target.value.toUpperCase())}
                className="absolute -inset-2 w-28 h-28 cursor-pointer border-0 bg-transparent"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                <span className="text-xs text-slate-400 font-mono">HEX</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-mono">{currentColor}</span>
                  <button
                    onClick={() => handleCopy(currentColor)}
                    className="p-1 hover:text-white text-slate-400"
                    title="Kopyala"
                  >
                    {copiedColor === currentColor ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                <span className="text-xs text-slate-400 font-mono">RGB</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-200 font-mono">{rgbString}</span>
                  <button
                    onClick={() => handleCopy(rgbString)}
                    className="p-1 hover:text-white text-slate-400"
                    title="Kopyala"
                  >
                    {copiedColor === rgbString ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Palette Row */}
          <div>
            <span className="block text-xs font-medium text-slate-400 mb-2">Seçili Palet</span>
            <div className="grid grid-cols-6 gap-2">
              {extractedPalette.map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentColor(col)}
                  className="group relative flex flex-col items-center rounded-xl p-1 transition-transform hover:scale-105"
                >
                  <div
                    className="w-full h-10 rounded-lg border border-white/10 shadow-sm"
                    style={{ backgroundColor: col }}
                  />
                  <span className="text-[10px] text-slate-400 font-mono mt-1 group-hover:text-white">
                    {col.slice(1, 4)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Upload photo to extract colors */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          <div>
            <span className="block text-sm font-semibold text-white mb-2">Fotoğraftan Palet Çıkar</span>
            <p className="text-xs text-slate-400 mb-4">
              Cihazınızdan bir fotoğraf seçin; fotoğrafın ana renklerini otomatik olarak tespit edelim.
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-800/30"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <span className="text-xs text-slate-300 font-medium block">
                {imagePreview ? 'Farklı Bir Fotoğraf Seç' : 'Fotoğraf Yükle'}
              </span>
            </div>
          </div>

          {imagePreview && (
            <div className="mt-4 flex items-center gap-3 p-2 bg-slate-900/60 rounded-lg border border-slate-800">
              <img
                src={imagePreview}
                alt="Kaynak Fotoğraf"
                className="w-12 h-12 rounded object-cover"
                loading="lazy"
              />
              <span className="text-xs text-slate-400">Palet başarıyla ayıklandı.</span>
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
};
