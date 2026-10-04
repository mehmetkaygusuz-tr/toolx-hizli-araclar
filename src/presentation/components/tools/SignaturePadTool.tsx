import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Download, Trash2, RotateCcw } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';

export const SignaturePadTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState<string>('#0f172a');
  const [penWidth, setPenWidth] = useState<number>(3);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set real resolution to avoid blur on retina displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `dijital-imza-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolCard
      id="dijital-imza"
      title="Dijital İmza Çizici & Şeffaf PNG"
      description="Resmi belgeler, sözleşmeler ve PDF evraklarınız için ekranda imzanızı atın ve arka plansız (şeffaf) PNG formatında kaydedin."
      icon={PenTool}
      categoryLabel="Pratik Günlük"
      actions={
        hasDrawn && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Temizle</span>
          </button>
        )
      }
    >
      <div className="space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 font-medium">Mürekkep:</span>
            <div className="flex items-center gap-1.5">
              {[
                { col: '#0f172a', label: 'Siyah' },
                { col: '#1e3a8a', label: 'Lacivert' },
                { col: '#2563eb', label: 'Mavi' },
              ].map((c) => (
                <button
                  key={c.col}
                  type="button"
                  onClick={() => setPenColor(c.col)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    penColor === c.col ? 'scale-110 border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.col }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 font-medium">Uç Kalınlığı:</span>
            <div className="flex items-center gap-1">
              {[2, 3, 5].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setPenWidth(w)}
                  className={`px-2.5 py-1 text-xs rounded border ${
                    penWidth === w ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!hasDrawn}
            onClick={handleDownload}
            className="flex items-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Şeffaf PNG Olarak İndir</span>
          </button>
        </div>

        {/* Drawing Area */}
        <div className="relative w-full h-64 bg-white rounded-2xl overflow-hidden shadow-inner border-2 border-slate-700 cursor-crosshair touch-none">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full block"
          />
          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs">
              İmzanızı fare veya parmağınızla buraya çizin
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
};
