import React, { useState, useRef, useEffect } from 'react';
import { ImageDown, Upload, Download, RefreshCw, Sliders, Check } from 'lucide-react';
import { ToolCard } from '../common/ToolCard';

interface ProcessedImage {
  originalFile: File;
  originalUrl: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  compressedUrl: string | null;
  compressedBlob: Blob | null;
  compressedSize: number;
  compressedWidth: number;
  compressedHeight: number;
  isProcessing: boolean;
}

export const ImageCompressorTool: React.FC = () => {
  const [imageState, setImageState] = useState<ProcessedImage | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [maxDimension, setMaxDimension] = useState<number>(1920);
  const [keepOriginalSize, setKeepOriginalSize] = useState<boolean>(true);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageState({
        originalFile: file,
        originalUrl: url,
        originalSize: file.size,
        originalWidth: img.width,
        originalHeight: img.height,
        compressedUrl: null,
        compressedBlob: null,
        compressedSize: 0,
        compressedWidth: img.width,
        compressedHeight: img.height,
        isProcessing: true,
      });
    };
  };

  // Process compression whenever parameters change
  useEffect(() => {
    if (!imageState || !imageState.originalUrl) return;

    let isMounted = true;
    const img = new Image();
    img.src = imageState.originalUrl;

    img.onload = () => {
      let targetWidth = img.width;
      let targetHeight = img.height;

      if (!keepOriginalSize && maxDimension > 0) {
        if (targetWidth > targetHeight && targetWidth > maxDimension) {
          targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
          targetWidth = maxDimension;
        } else if (targetHeight > maxDimension) {
          targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
          targetHeight = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (!isMounted || !blob) return;
          const compressedUrl = URL.createObjectURL(blob);
          setImageState((prev) =>
            prev
              ? {
                  ...prev,
                  compressedUrl,
                  compressedBlob: blob,
                  compressedSize: blob.size,
                  compressedWidth: targetWidth,
                  compressedHeight: targetHeight,
                  isProcessing: false,
                }
              : null
          );
        },
        format,
        format === 'image/png' ? undefined : quality / 100
      );
    };

    return () => {
      isMounted = false;
    };
  }, [imageState?.originalUrl, quality, format, maxDimension, keepOriginalSize]);

  const handleDownload = () => {
    if (!imageState || !imageState.compressedBlob) return;
    const ext = format === 'image/webp' ? 'webp' : format === 'image/jpeg' ? 'jpg' : 'png';
    const baseName = imageState.originalFile.name.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(imageState.compressedBlob);
    a.download = `${baseName}-toolx-sikistirilmis.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (imageState?.originalUrl) URL.revokeObjectURL(imageState.originalUrl);
    if (imageState?.compressedUrl) URL.revokeObjectURL(imageState.compressedUrl);
    setImageState(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const percentReduction =
    imageState && imageState.compressedSize > 0
      ? Math.round(((imageState.originalSize - imageState.compressedSize) / imageState.originalSize) * 100)
      : 0;

  return (
    <ToolCard
      id="gorsel-sikistir"
      title="Görsel Sıkıştırıcı & Boyutlandırıcı"
      description="Resimlerinizi cihazınızdan sunucuya yüklemeden %100 gizli, ultra hızlı sıkıştırın ve WebP/JPEG formatına dönüştürün."
      icon={ImageDown}
      categoryLabel="Görsel & Medya"
      actions={
        imageState && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Yeni Resim</span>
          </button>
        )
      }
    >
      {!imageState ? (
        /* Upload Area */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileSelect(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            dragOver
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700/80 hover:border-slate-600 bg-slate-800/30 hover:bg-slate-800/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/bmp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />
          <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 mb-4 border border-blue-500/20">
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-base font-medium text-white mb-1">
            Resmi buraya sürükleyin veya <span className="text-blue-400 underline underline-offset-4">seçmek için tıklayın</span>
          </p>
          <p className="text-xs text-slate-400">
            PNG, JPEG, WebP, BMP desteklenir · Cihazınızda işlenir, sunucuya hiçbir veri gitmez
          </p>
        </div>
      ) : (
        /* Image Adjustments & Preview Panel */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls column */}
          <div className="lg:col-span-5 space-y-5 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>Sıkıştırma & Format Ayarları</span>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Çıktı Formatı</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'image/webp', label: 'WebP (Önerilen)' },
                  { id: 'image/jpeg', label: 'JPEG' },
                  { id: 'image/png', label: 'PNG' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setFormat(fmt.id as typeof format)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg transition-all border ${
                      format === fmt.id
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider (for WebP & JPEG) */}
            {format !== 'image/png' && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span className="font-medium">Kalite Dengesi</span>
                  <span className="font-mono tabular-nums text-blue-400 font-semibold">%{quality}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Daha Küçük Dosya</span>
                  <span>Daha Yüksek Kalite</span>
                </div>
              </div>
            )}

            {/* Resolution Resizing */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-300">Maksimum Genişlik/Yükseklik</label>
                <button
                  type="button"
                  onClick={() => setKeepOriginalSize(!keepOriginalSize)}
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                >
                  {keepOriginalSize ? 'Orijinal Boyutu Koru' : 'Yeniden Boyutlandır'}
                </button>
              </div>

              {!keepOriginalSize && (
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1080, 1920, 2560, 3840].map((dim) => (
                      <button
                        key={dim}
                        type="button"
                        onClick={() => setMaxDimension(dim)}
                        className={`py-1.5 px-2 text-xs rounded border ${
                          maxDimension === dim
                            ? 'bg-blue-600/20 text-blue-400 border-blue-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {dim}px
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={maxDimension}
                    onChange={(e) => setMaxDimension(Math.max(100, Number(e.target.value)))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="Maksimum piksel"
                  />
                </div>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={imageState.isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Sıkıştırılmış Resmi İndir</span>
            </button>
          </div>

          {/* Preview & Stats column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* Stats Comparison Card */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-800/40 rounded-xl border border-slate-800">
              <div>
                <span className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">Orijinal Boyut</span>
                <span className="text-base font-semibold text-slate-300 font-mono tabular-nums">
                  {formatFileSize(imageState.originalSize)}
                </span>
                <span className="block text-xs text-slate-500">
                  {imageState.originalWidth} × {imageState.originalHeight} px
                </span>
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">Yeni Boyut</span>
                <span className="text-base font-semibold text-white font-mono tabular-nums">
                  {imageState.isProcessing ? 'İşleniyor...' : formatFileSize(imageState.compressedSize)}
                </span>
                <span className="block text-xs text-slate-500">
                  {imageState.compressedWidth} × {imageState.compressedHeight} px
                </span>
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">Tasarruf Oranı</span>
                <span
                  className={`text-base font-semibold font-mono tabular-nums flex items-center gap-1 ${
                    percentReduction > 0 ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {percentReduction > 0 ? (
                    <>
                      <Check className="w-4 h-4" />
                      -%{percentReduction}
                    </>
                  ) : (
                    '%0'
                  )}
                </span>
                <span className="block text-xs text-emerald-500/80">Daha hafif &amp; hızlı</span>
              </div>
            </div>

            {/* Visual Image Preview */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2 min-h-[260px] max-h-[400px]">
              {imageState.compressedUrl ? (
                <img
                  src={imageState.compressedUrl}
                  alt="Önizleme"
                  className="max-h-[360px] max-w-full object-contain rounded-lg"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Resim işleniyor...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
};
