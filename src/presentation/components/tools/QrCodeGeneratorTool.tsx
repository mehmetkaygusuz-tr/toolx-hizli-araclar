import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Download, Link, Wifi, MessageSquare, Type } from 'lucide-react';
import QRCode from 'qrcode';
import { ToolCard } from '../common/ToolCard';

type QrType = 'url' | 'wifi' | 'whatsapp' | 'text';

export const QrCodeGeneratorTool: React.FC = () => {
  const [qrType, setQrType] = useState<QrType>('url');

  // Input states
  const [urlInput, setUrlInput] = useState<string>('https://toolx.com.tr');
  const [textInput, setTextInput] = useState<string>('Merhaba ToolX!');
  const [wifiSsid, setWifiSsid] = useState<string>('Ev-Agi');
  const [wifiPassword, setWifiPassword] = useState<string>('guclusifre123');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [waPhone, setWaPhone] = useState<string>('905551234567');
  const [waMessage, setWaMessage] = useState<string>('Merhaba, bilgi almak istiyorum.');

  // Customization
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute final payload
  const getPayload = () => {
    switch (qrType) {
      case 'url':
        return urlInput.startsWith('http') ? urlInput : `https://${urlInput}`;
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case 'whatsapp':
        return `https://wa.me/${waPhone.replace(/\D/g, '')}?text=${encodeURIComponent(waMessage)}`;
      case 'text':
      default:
        return textInput;
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const payload = getPayload();
    if (!payload) return;

    QRCode.toCanvas(
      canvasRef.current,
      payload,
      {
        width: 256,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      },
      (error) => {
        if (error) console.error(error);
      }
    );
  }, [qrType, urlInput, textInput, wifiSsid, wifiPassword, wifiEncryption, waPhone, waMessage, fgColor, bgColor]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = `toolx-qr-kod.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolCard
      id="qr-kod-olusturucu"
      title="QR Kod Oluşturucu & İndirici"
      description="Web sitesi linki, Wi-Fi ağı bağlantısı veya WhatsApp mesajı için yüksek çözünürlüklü QR kod üretin ve indirin."
      icon={QrCode}
      categoryLabel="Pratik Günlük"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-7 space-y-4 bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          {/* Type Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'url', label: 'Web Sitesi', icon: Link },
              { id: 'wifi', label: 'Wi-Fi Ağı', icon: Wifi },
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
              { id: 'text', label: 'Düz Metin', icon: Type },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setQrType(t.id as QrType)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                    qrType === t.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Type Specific Fields */}
          {qrType === 'url' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Web Sitesi Adresi (URL)</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Wi-Fi Ağ Adı (SSID)</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="Ağınızın adı"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Wi-Fi Şifresi</label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="Kablosuz ağ şifresi"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {qrType === 'whatsapp' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Telefon Numarası (Ülke kodu ile)</label>
                <input
                  type="tel"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="Örn: 905XXXXXXXXX"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Hazır Mesaj</label>
                <input
                  type="text"
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  placeholder="Kullanıcı karekodu okuttuğunda açılacak mesaj"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {qrType === 'text' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Düz Metin</label>
              <textarea
                rows={3}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="QR kod içine yazılacak serbest metin..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>
          )}

          {/* Color Customization */}
          <div className="pt-2 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Ön Renk:</span>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Arka Renk:</span>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Preview & Download */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between bg-slate-800/40 p-5 rounded-xl border border-slate-800">
          <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-700">
            <canvas ref={canvasRef} className="rounded-lg max-w-full" />
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-blue-600/20"
          >
            <Download className="w-4 h-4" />
            <span>QR Kodu İndir (PNG)</span>
          </button>
        </div>
      </div>
    </ToolCard>
  );
};
