import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  QrCode,
  Download,
  Link as LinkIcon,
  Wifi,
  MessageSquare,
  Type,
  Contact,
  Mail,
  MapPin,
  Scan,
  Camera,
  Upload,
  Clipboard,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  FileCode,
  AlertCircle,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { ToolCard } from '../common/ToolCard';

type MainTab = 'create' | 'scan';
type QrType = 'url' | 'wifi' | 'vcard' | 'email' | 'location' | 'whatsapp' | 'text';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

interface ParsedQrResult {
  raw: string;
  type: 'url' | 'wifi' | 'vcard' | 'email' | 'geo' | 'text';
  wifiData?: { ssid: string; pass: string; type: string; hidden: boolean };
  vcardData?: { name?: string; phone?: string; email?: string; org?: string; title?: string };
  geoData?: { lat: string; lng: string; url: string };
  emailData?: { to: string; subject?: string; body?: string };
}

export const QrCodeGeneratorTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('create');

  // Generator states
  const [qrType, setQrType] = useState<QrType>('url');
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('M');
  const [downloadSize, setDownloadSize] = useState<number>(512);

  // Payload inputs
  const [urlInput, setUrlInput] = useState<string>('https://toolx.com.tr');
  const [textInput, setTextInput] = useState<string>('Merhaba ToolX!');
  
  // Wi-Fi inputs
  const [wifiSsid, setWifiSsid] = useState<string>('Ofis-Misafir');
  const [wifiPassword, setWifiPassword] = useState<string>('guclusifre2026');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState<boolean>(false);

  // vCard inputs (RFC 2426 - vCard 3.0 format for universal mobile compatibility)
  const [vcardName, setVcardName] = useState<string>('Ahmet Yılmaz');
  const [vcardOrg, setVcardOrg] = useState<string>('ToolX Teknoloji');
  const [vcardTitle, setVcardTitle] = useState<string>('Yazılım Mimarı');
  const [vcardPhone, setVcardPhone] = useState<string>('+90 555 123 4567');
  const [vcardEmail, setVcardEmail] = useState<string>('ahmet@toolx.com.tr');
  const [vcardWebsite, setVcardWebsite] = useState<string>('https://toolx.com.tr');

  // Email inputs
  const [emailTo, setEmailTo] = useState<string>('destek@toolx.com.tr');
  const [emailSubject, setEmailSubject] = useState<string>('Bilgi Talebi');
  const [emailBody, setEmailBody] = useState<string>('Merhaba, hizmetleriniz hakkında bilgi almak istiyorum.');

  // Location inputs (Ankara Kızılay default)
  const [geoLat, setGeoLat] = useState<string>('39.9208');
  const [geoLng, setGeoLng] = useState<string>('32.8541');

  // WhatsApp inputs
  const [waPhone, setWaPhone] = useState<string>('905551234567');
  const [waMessage, setWaMessage] = useState<string>('Merhaba, bilgi alabilir miyim?');

  // Colors
  const [fgColor, setFgColor] = useState<string>('#00E5FF');
  const [bgColor, setBgColor] = useState<string>('#080C14');

  // Generator refs & copies
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [copiedSvg, setCopiedSvg] = useState<boolean>(false);

  // Scanner states
  const [scanResult, setScanResult] = useState<ParsedQrResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isScanningCamera, setIsScanningCamera] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [copiedScanText, setCopiedScanText] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const scanAnimFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute final QR payload adhering to official standards
  const getPayload = useCallback((): string => {
    switch (qrType) {
      case 'url': {
        const trimmed = urlInput.trim();
        if (!trimmed) return 'https://toolx.com.tr';
        return trimmed.startsWith('http://') || trimmed.startsWith('https://')
          ? trimmed
          : `https://${trimmed}`;
      }
      case 'wifi': {
        const hParam = wifiHidden ? ';H:true' : '';
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword}${hParam};;`;
      }
      case 'vcard': {
        // vCard 3.0 format for 100% native iOS / Android camera recognition
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${vcardName}`,
          `N:${vcardName.split(' ').slice(1).join(' ')};${vcardName.split(' ')[0]};;;`,
          vcardOrg ? `ORG:${vcardOrg}` : '',
          vcardTitle ? `TITLE:${vcardTitle}` : '',
          vcardPhone ? `TEL;TYPE=CELL:${vcardPhone.replace(/\s+/g, '')}` : '',
          vcardEmail ? `EMAIL:${vcardEmail}` : '',
          vcardWebsite ? `URL:${vcardWebsite}` : '',
          'END:VCARD',
        ]
          .filter(Boolean)
          .join('\n');
      }
      case 'email': {
        const queryParams: string[] = [];
        if (emailSubject) queryParams.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) queryParams.push(`body=${encodeURIComponent(emailBody)}`);
        const query = queryParams.length ? `?${queryParams.join('&')}` : '';
        return `mailto:${emailTo}${query}`;
      }
      case 'location': {
        const lat = geoLat.trim() || '39.9208';
        const lng = geoLng.trim() || '32.8541';
        return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      }
      case 'whatsapp': {
        const phone = waPhone.replace(/\D/g, '');
        return `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;
      }
      case 'text':
      default:
        return textInput || ' ';
    }
  }, [
    qrType,
    urlInput,
    wifiSsid,
    wifiEncryption,
    wifiPassword,
    wifiHidden,
    vcardName,
    vcardOrg,
    vcardTitle,
    vcardPhone,
    vcardEmail,
    vcardWebsite,
    emailTo,
    emailSubject,
    emailBody,
    geoLat,
    geoLng,
    waPhone,
    waMessage,
    textInput,
  ]);

  // Render QR on canvas
  useEffect(() => {
    if (activeTab !== 'create' || !canvasRef.current) return;
    const payload = getPayload();

    QRCode.toCanvas(
      canvasRef.current,
      payload,
      {
        width: 256,
        margin: 2, // Standard quiet zone
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      },
      (error) => {
        if (error) console.error('QR Oluşturma Hatası:', error);
      }
    );
  }, [activeTab, getPayload, errorCorrection, fgColor, bgColor]);

  // Download high-res PNG
  const handleDownloadPng = async () => {
    const payload = getPayload();
    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        width: downloadSize,
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `toolx-qr-${qrType}-${downloadSize}px.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('PNG İndirme Hatası:', err);
    }
  };

  // Download pure vector SVG
  const handleDownloadSvg = async () => {
    const payload = getPayload();
    try {
      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `toolx-qr-${qrType}-vektorel.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('SVG İndirme Hatası:', err);
    }
  };

  // Copy SVG Code
  const handleCopySvg = async () => {
    const payload = getPayload();
    try {
      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      await navigator.clipboard.writeText(svgString);
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2000);
    } catch (err) {
      console.error('SVG Kopyalama Hatası:', err);
    }
  };

  // Copy raw payload
  const handleCopyPayload = async () => {
    await navigator.clipboard.writeText(getPayload());
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  // Parse QR raw string intelligently
  const parseQrContent = (raw: string): ParsedQrResult => {
    const text = raw.trim();

    // 1. Wi-Fi: WIFI:S:<ssid>;T:<type>;P:<pass>;H:<hidden>;;
    if (text.startsWith('WIFI:')) {
      const ssidMatch = text.match(/S:([^;]+)/);
      const passMatch = text.match(/P:([^;]+)/);
      const typeMatch = text.match(/T:([^;]+)/);
      const hiddenMatch = text.match(/H:(true|false)/i);

      return {
        raw: text,
        type: 'wifi',
        wifiData: {
          ssid: ssidMatch ? ssidMatch[1] : 'Bilinmiyor',
          pass: passMatch ? passMatch[1] : '',
          type: typeMatch ? typeMatch[1] : 'WPA',
          hidden: hiddenMatch ? hiddenMatch[1].toLowerCase() === 'true' : false,
        },
      };
    }

    // 2. vCard: BEGIN:VCARD ... END:VCARD
    if (text.includes('BEGIN:VCARD')) {
      const fnMatch = text.match(/FN:(.+)/i);
      const telMatch = text.match(/TEL.*:(.+)/i);
      const emailMatch = text.match(/EMAIL.*:(.+)/i);
      const orgMatch = text.match(/ORG.*:(.+)/i);
      const titleMatch = text.match(/TITLE.*:(.+)/i);

      return {
        raw: text,
        type: 'vcard',
        vcardData: {
          name: fnMatch ? fnMatch[1].trim() : undefined,
          phone: telMatch ? telMatch[1].trim() : undefined,
          email: emailMatch ? emailMatch[1].trim() : undefined,
          org: orgMatch ? orgMatch[1].trim() : undefined,
          title: titleMatch ? titleMatch[1].trim() : undefined,
        },
      };
    }

    // 3. Email: mailto:
    if (text.startsWith('mailto:')) {
      const clean = text.replace('mailto:', '');
      const [to, query] = clean.split('?');
      const params = new URLSearchParams(query || '');
      return {
        raw: text,
        type: 'email',
        emailData: {
          to: decodeURIComponent(to),
          subject: params.get('subject') || undefined,
          body: params.get('body') || undefined,
        },
      };
    }

    // 4. Location: geo: or Google Maps URL
    if (text.startsWith('geo:') || text.includes('maps.google') || text.includes('google.com/maps')) {
      let lat = '';
      let lng = '';
      if (text.startsWith('geo:')) {
        const coords = text.replace('geo:', '').split('?')[0].split(',');
        lat = coords[0];
        lng = coords[1];
      } else {
        const queryMatch = text.match(/query=([^&]+)/) || text.match(/q=([^&]+)/);
        if (queryMatch) {
          const parts = queryMatch[1].split(',');
          lat = parts[0];
          lng = parts[1];
        }
      }

      return {
        raw: text,
        type: 'geo',
        geoData: {
          lat: lat || '39.9208',
          lng: lng || '32.8541',
          url: text.startsWith('http') ? text : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        },
      };
    }

    // 5. URL
    if (/^https?:\/\//i.test(text) || /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/i.test(text)) {
      return {
        raw: text,
        type: 'url',
      };
    }

    // 6. Generic Text
    return {
      raw: text,
      type: 'text',
    };
  };

  // Decode Image using jsQR
  const decodeImageData = (imageData: ImageData): string | null => {
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });
    return code ? code.data : null;
  };

  // File Upload Decoder
  const handleFileUpload = (file: File) => {
    setScanError(null);
    if (!file.type.startsWith('image/')) {
      setScanError('Lütfen geçerli bir resim dosyası seçin (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setScanError('Görsel işleme bağlamı başlatılamadı.');
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const decoded = decodeImageData(imgData);

        if (decoded) {
          setScanResult(parseQrContent(decoded));
          setScanError(null);
        } else {
          setScanError('Görselde okunabilir bir QR kod bulunamadı. Lütfen görselin net olduğundan emin olun.');
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Clipboard Paste Handler
  const handlePasteFromClipboard = async () => {
    setScanError(null);
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'clipboard.png', { type: imageType });
          handleFileUpload(file);
          return;
        }
      }
      setScanError('Panoda görsel bulunamadı. Lütfen bir ekran görüntüsü kopyalayın (Ctrl+V / PrintScreen).');
    } catch {
      setScanError('Panoya erişim izni verilmedi veya panoda görsel yok. Dosya yükleme seçeneğini kullanabilirsiniz.');
    }
  };

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (scanAnimFrameRef.current) {
      cancelAnimationFrame(scanAnimFrameRef.current);
      scanAnimFrameRef.current = null;
    }
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setIsScanningCamera(false);
    setCameraLoading(false);
  }, []);

  // Start Camera with Environment Lens
  const startCamera = async () => {
    setScanError(null);
    setCameraLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanningCamera(true);
        setCameraLoading(false);
        startScanningLoop();
      }
    } catch {
      setCameraLoading(false);
      setScanError('Kameraya erişilemedi. Lütfen kamera izinlerinizi kontrol edin veya görsel yüklemeyi tercih edin.');
    }
  };

  // Live video frame scanning loop
  const startScanningLoop = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const scanFrame = () => {
      if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        scanAnimFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const decoded = decodeImageData(imgData);

        if (decoded) {
          setScanResult(parseQrContent(decoded));
          stopCamera();
          return;
        }
      }

      scanAnimFrameRef.current = requestAnimationFrame(scanFrame);
    };

    scanAnimFrameRef.current = requestAnimationFrame(scanFrame);
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <ToolCard
      id="qr-kod-olusturucu"
      title="QR Kod Stüdyosu & Tarayıcı"
      description="ISO/IEC 18004:2024 standartlarında vektörel SVG ve yüksek çözünürlüklü QR kod üretin veya kameranızdan/görselden QR kod tarayın."
      icon={QrCode}
      categoryLabel="Pratik Günlük"
    >
      {/* Main Mode Tabs: Oluşturucu & Tarayıcı */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
        <button
          type="button"
          onClick={() => {
            stopCamera();
            setActiveTab('create');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'create'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Kod Oluşturucu</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('scan');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'scan'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Scan className="w-4 h-4" />
          <span>QR Kod Tara / Oku</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. TAB: QR KOD OLUŞTURUCU */}
      {/* ============================================================== */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-5 bg-slate-900/70 p-5 rounded-2xl border border-slate-800">
            {/* Type Switcher */}
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                QR Veri Türü & Yükü
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
                {[
                  { id: 'url', label: 'Metin/URL', icon: LinkIcon },
                  { id: 'wifi', label: 'Wi-Fi Ağı', icon: Wifi },
                  { id: 'vcard', label: 'vCard 3.0', icon: Contact },
                  { id: 'email', label: 'E-Posta', icon: Mail },
                  { id: 'location', label: 'Konum', icon: MapPin },
                  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                  { id: 'text', label: 'Düz Metin', icon: Type },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setQrType(t.id as QrType)}
                      className={`py-2 px-1 text-[11px] font-medium rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        qrType === t.id
                          ? 'bg-blue-600/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                          : 'bg-slate-800/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate w-full text-center">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs based on type */}
            <div className="space-y-4 pt-1">
              {/* URL */}
              {qrType === 'url' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Bağlantı veya Web Adresi (URL)
                  </label>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://toolx.com.tr"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>
              )}

              {/* Wi-Fi */}
              {qrType === 'wifi' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Wi-Fi Ağ Adı (SSID)</label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="Kablosuz ağınızın adı"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Wi-Fi Şifresi</label>
                      <input
                        type="text"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="Şifre"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Güvenlik Türü</label>
                      <select
                        value={wifiEncryption}
                        onChange={(e) => setWifiEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none cursor-pointer"
                      >
                        <option value="WPA">WPA / WPA2 / WPA3</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Şifresiz (Açık Ağ)</option>
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-slate-300 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Gizli Ağ (SSID yayınını gizleyen ağlar)</span>
                  </label>
                </div>
              )}

              {/* vCard 3.0 */}
              {qrType === 'vcard' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Ad Soyad</label>
                      <input
                        type="text"
                        value={vcardName}
                        onChange={(e) => setVcardName(e.target.value)}
                        placeholder="Örn: Ahmet Yılmaz"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Telefon Numarası</label>
                      <input
                        type="tel"
                        value={vcardPhone}
                        onChange={(e) => setVcardPhone(e.target.value)}
                        placeholder="+90 555 123 4567"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Şirket / Kurum</label>
                      <input
                        type="text"
                        value={vcardOrg}
                        onChange={(e) => setVcardOrg(e.target.value)}
                        placeholder="Örn: ToolX Ltd."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Unvan</label>
                      <input
                        type="text"
                        value={vcardTitle}
                        onChange={(e) => setVcardTitle(e.target.value)}
                        placeholder="Örn: Kıdemli Mühendis"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">E-Posta</label>
                      <input
                        type="email"
                        value={vcardEmail}
                        onChange={(e) => setVcardEmail(e.target.value)}
                        placeholder="ahmet@sirket.com"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Web Sitesi</label>
                      <input
                        type="url"
                        value={vcardWebsite}
                        onChange={(e) => setVcardWebsite(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              {qrType === 'email' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Kime (E-Posta Adresi)</label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="ornek@alanadi.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Konu Başlığı</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="E-posta konusu"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Mesaj İçeriği</label>
                    <textarea
                      rows={2}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Varsayılan mesaj taslağı..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Location */}
              {qrType === 'location' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Enlem (Latitude)</label>
                      <input
                        type="text"
                        value={geoLat}
                        onChange={(e) => setGeoLat(e.target.value)}
                        placeholder="39.9208"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Boylam (Longitude)</label>
                      <input
                        type="text"
                        value={geoLng}
                        onChange={(e) => setGeoLng(e.target.value)}
                        placeholder="32.8541"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Örnek: Ankara (39.9208, 32.8541) • İstanbul (41.0082, 28.9784)
                  </p>
                </div>
              )}

              {/* WhatsApp */}
              {qrType === 'whatsapp' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Telefon Numarası (Ülke kodu dahil, başında + olmadan)
                    </label>
                    <input
                      type="tel"
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      placeholder="905XXXXXXXXX"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Hazır Mesaj Metni</label>
                    <input
                      type="text"
                      value={waMessage}
                      onChange={(e) => setWaMessage(e.target.value)}
                      placeholder="Okutunca otomatik açılacak mesaj"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Free Text */}
              {qrType === 'text' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Serbest Düz Metin</label>
                  <textarea
                    rows={3}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="QR kod içine yazılacak serbest metin..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>
              )}
            </div>

            {/* Customization: Colors, Error Correction & Resolution */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Colors */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">QR Rengi:</span>
                  <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-lg p-1">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-[11px] font-mono text-slate-300 uppercase">{fgColor}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Arka Plan:</span>
                  <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-lg p-1">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-[11px] font-mono text-slate-300 uppercase">{bgColor}</span>
                  </div>
                </div>
              </div>

              {/* Error Correction & Resolution */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Hata Düzeltme (ISO):</label>
                  <select
                    value={errorCorrection}
                    onChange={(e) => setErrorCorrection(e.target.value as ErrorCorrectionLevel)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs rounded-lg p-1.5 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="L">Düşük (L - %7)</option>
                    <option value="M">Orta (M - %15)</option>
                    <option value="Q">Çeyrek (Q - %25)</option>
                    <option value="H">Yüksek (H - %30)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">İndirme Boyutu:</label>
                  <select
                    value={downloadSize}
                    onChange={(e) => setDownloadSize(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-xs rounded-lg p-1.5 text-white focus:outline-none cursor-pointer"
                  >
                    <option value={256}>256 × 256 px</option>
                    <option value={512}>512 × 512 px</option>
                    <option value={1024}>1024 × 1024 px</option>
                    <option value={2048}>2048 × 2048 px</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Action Buttons */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between bg-slate-900/70 p-5 rounded-2xl border border-slate-800">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Önizleme (ISO/IEC 18004:2024)</span>
              </span>
              <span className="text-[11px] bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
                {errorCorrection} Toleransı
              </span>
            </div>

            {/* Canvas Box */}
            <div
              className="p-4 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-center transition-all"
              style={{ backgroundColor: bgColor }}
            >
              <canvas ref={canvasRef} className="rounded-lg max-w-[220px] max-h-[220px]" />
            </div>

            {/* Quick Actions */}
            <div className="w-full mt-5 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-xl transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
                  title="Baskı ve matbaa için kayıpsız vektörel SVG"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Vektörel SVG İndir</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                  title={`${downloadSize}px çözünürlükte PNG`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Raster PNG İndir</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopySvg}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5" />}
                  <span>{copiedSvg ? 'SVG Kopyalandı!' : 'SVG Kodu Kopyala'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPayload ? 'İçerik Kopyalandı!' : 'Metin Yükü Kopyala'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. TAB: QR KOD TARA / OKU */}
      {/* ============================================================== */}
      {activeTab === 'scan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scanner Input Channels */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Scan className="w-4 h-4 text-cyan-400" />
                <span>QR Kod Tarama Yöntemi</span>
              </h3>

              {/* Camera Scanner View */}
              {isScanningCamera ? (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-cyan-500/50 shadow-2xl">
                  <video ref={videoRef} className="w-full h-full object-cover" />
                  
                  {/* Targeting frame & animated scanline */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-cyan-400 rounded-2xl relative shadow-lg">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan-300 -mt-1 -ml-1 rounded-tl" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyan-300 -mt-1 -mr-1 rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyan-300 -mb-1 -ml-1 rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-300 -mb-1 -mr-1 rounded-br" />
                      {/* Animated scanning bar */}
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce mt-24" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={stopCamera}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-medium rounded-lg shadow-lg cursor-pointer"
                  >
                    Kamerayı Kapat
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={cameraLoading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>{cameraLoading ? 'Kamera Başlatılıyor...' : 'Kamera ile Canlı Tara'}</span>
                </button>
              )}

              {/* Drag & Drop File Upload */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-950/60 hover:bg-slate-950 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
                <span className="text-sm font-medium text-slate-200">Görsel Dosyası Yükleyin veya Sürükleyin</span>
                <span className="text-xs text-slate-500 mt-1">PNG, JPG, WebP veya ekran görüntüsü</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </div>

              {/* Paste from Clipboard */}
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Clipboard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Panodaki Ekran Görüntüsünü Yapıştır (Ctrl+V)</span>
              </button>

              {/* Error Message */}
              {scanError && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{scanError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Scanner Decoded Result Box */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Tarama & Çözümleme Sonucu
                  </span>
                  {scanResult && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>
                        {scanResult.type === 'wifi'
                          ? 'Wi-Fi Ağı'
                          : scanResult.type === 'vcard'
                          ? 'vCard Kartvizit'
                          : scanResult.type === 'url'
                          ? 'Web Bağlantısı'
                          : scanResult.type === 'email'
                          ? 'E-Posta'
                          : scanResult.type === 'geo'
                          ? 'Harita Konumu'
                          : 'Düz Metin'}
                      </span>
                    </span>
                  )}
                </div>

                {scanResult ? (
                  <div className="mt-4 space-y-4">
                    {/* Specialized Parsed Info */}
                    {scanResult.type === 'wifi' && scanResult.wifiData && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Ağ Adı (SSID):</span>
                          <span className="font-semibold text-white font-mono">{scanResult.wifiData.ssid}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Şifre:</span>
                          <span className="font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded">
                            {scanResult.wifiData.pass || '(Şifresiz)'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Güvenlik:</span>
                          <span className="text-slate-300">{scanResult.wifiData.type}</span>
                        </div>
                      </div>
                    )}

                    {scanResult.type === 'vcard' && scanResult.vcardData && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        {scanResult.vcardData.name && (
                          <div className="text-sm font-semibold text-white">{scanResult.vcardData.name}</div>
                        )}
                        {scanResult.vcardData.title && (
                          <div className="text-xs text-slate-400">
                            {scanResult.vcardData.title} {scanResult.vcardData.org && `• ${scanResult.vcardData.org}`}
                          </div>
                        )}
                        {scanResult.vcardData.phone && (
                          <div className="text-xs font-mono text-cyan-300 pt-1">
                            Tel: {scanResult.vcardData.phone}
                          </div>
                        )}
                        {scanResult.vcardData.email && (
                          <div className="text-xs font-mono text-slate-300">
                            E-posta: {scanResult.vcardData.email}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Raw Text Output */}
                    <div>
                      <span className="block text-xs font-medium text-slate-400 mb-1">Ham Metin / Bağlantı:</span>
                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 break-all select-all max-h-48 overflow-y-auto">
                        {scanResult.raw}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-500">
                    <Scan className="w-12 h-12 mx-auto text-slate-700 mb-3" />
                    <p className="text-sm">Henüz bir QR kod taranmadı.</p>
                    <p className="text-xs text-slate-600 mt-1">Kamera, görsel yükleme veya panodan yapıştırma yapabilirsiniz.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons for Decoded Result */}
              {scanResult && (
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(scanResult.raw);
                      setCopiedScanText(true);
                      setTimeout(() => setCopiedScanText(false), 2000);
                    }}
                    className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedScanText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScanText ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
                  </button>

                  {scanResult.type === 'url' && (
                    <a
                      href={scanResult.raw.startsWith('http') ? scanResult.raw : `https://${scanResult.raw}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-cyan-600/20"
                    >
                      <span>Bağlantıyı Aç</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {scanResult.type === 'geo' && scanResult.geoData && (
                    <a
                      href={scanResult.geoData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Haritada Gör</span>
                    </a>
                  )}

                  {scanResult.type === 'email' && scanResult.emailData && (
                    <a
                      href={`mailto:${scanResult.emailData.to}`}
                      className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>E-Posta Gönder</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setScanResult(null);
                      setScanError(null);
                    }}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    title="Sonucu Temizle"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
};
