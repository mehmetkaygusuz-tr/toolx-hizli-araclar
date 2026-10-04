import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Scale, FileText, Lock, EyeOff, ServerOff, Database } from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'imprint';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h2 id="legal-modal-title" className="text-base font-semibold text-white">
              Yasal Bilgilendirme & Gizlilik Politikası
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Gizlilik & KVKK</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'terms'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Kullanım Koşulları & Yasal Uyarı</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('imprint')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'imprint'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Künye & İletişim</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed font-normal">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-950/20 border border-blue-900/40 rounded-xl flex items-start gap-3 text-blue-200">
                <ServerOff className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-0.5">Sıfır Sunucu & %100 İstemci Taraflı Güvence</h4>
                  <p className="text-[11px] leading-relaxed text-blue-200/90">
                    ToolX Hızlı Araçlar mimarisinde hiçbir veriniz (görselleriniz, metinleriniz, şifreleriniz, çizdiğiniz imzalar veya hesaplamalarınız) harici bir sunucuya veya üçüncü taraflara iletilmez. Tüm işlemler doğrudan kendi tarayıcınızın donanımında gerçekleşir.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">6698 Sayılı KVKK Kapsamında Aydınlatma</h3>
                <p>
                  ToolX, ticari amaç gütmeyen, kullanıcıların günlük pratik işlemlerini kolaylaştıran ücretsiz bir web modülüdür. Sitede üyelik sistemi, form kaydı, veri tabanı veya kullanıcı takip (telemetri/analitik) sistemleri bulunmamaktadır.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-white mb-1 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  <span>Çerezler ve Yerel Depolama (LocalStorage) Kullanımı</span>
                </h4>
                <p className="mb-2">
                  Sitemizde reklam veya takip amaçlı üçüncü taraf çerezleri (cookies) <strong>kesinlikle kullanılmaz</strong>.
                </p>
                <p>
                  Yalnızca kullanıcı deneyimini korumak adına tarayıcınızın kendi yerel depolama hafızası (<code>localStorage</code>) şu amaçlarla kullanılır:
                </p>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-400 pl-1">
                  <li><code>toolx_pinned_tools</code>: Ana ekranda sık kullandığınız araçları sabitlemek için.</li>
                  <li><code>toolx_scratchpad_notes</code>: Hızlı Not aracına yazdığınız notların tarayıcıyı kapattığınızda silinmemesi için.</li>
                </ul>
                <p className="mt-2 text-slate-400">
                  Bu veriler yalnızca cihazınızda barınır; dilediğiniz zaman tarayıcınızın geçmişini ve site verilerini temizleyerek tamamen silebilirsiniz.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-white mb-1 flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-blue-400" />
                  <span>İzleyici ve Telemetri Yoktur</span>
                </h4>
                <p>
                  Sitemizde Google Analytics, Meta Pixel veya benzeri herhangi bir kullanıcı davranış izleyicisi bulunmamaktadır. Gizliliğiniz varsayılan olarak korunur.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">Kullanım Koşulları ve Sorumluluk Sınırı</h3>
                <p>
                  ToolX Hızlı Araçlar üzerinde yer alan tüm araçlar, formüller ve yazılımlar &quot;olduğu gibi&quot; (as-is) esasıyla, hiçbir ticari kâr amacı güdülmeksizin genel kullanıcı kolaylığı için sunulmaktadır.
                </p>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
                <h4 className="text-xs font-semibold text-amber-300">1. Dijital İmza Aracı Yasal Çekincesi (5070 Sayılı Kanun)</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Dijital İmza aracı yalnızca görsel paraf/çizim üretir. 5070 Sayılı Elektronik İmza Kanunu kapsamında tanımlanan Nitelikli Elektronik Sertifikaya dayalı &quot;Güvenli Elektronik İmza&quot; niteliğinde değildir. Resmi işlemlerde ve ıslak imza zorunluluğu olan sözleşmelerde geçerlilik taşımaz.
                </p>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
                <h4 className="text-xs font-semibold text-sky-300">2. Sağlık ve VKİ Hesaplayıcı Uyarısı (1219 Sayılı Kanun)</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Vücut Kitle İndeksi ve ideal kilo hesaplama aracı Dünya Sağlık Örgütü (WHO) genel yetişkin formüllerini kullanır. Tıbbi tanı, teşhis, tedavi veya klinik diyet tavsiyesi niteliğinde değildir. Her türlü sağlık kararı için uzman hekime başvurulmalıdır.
                </p>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
                <h4 className="text-xs font-semibold text-emerald-300">3. Mali ve Vergi Hesaplamaları Uyarısı (3568 Sayılı Kanun & VUK)</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  KDV, tevkifat ve iskonto hesaplayıcıları genel matematiksel bilgilendirme amaçlıdır. Resmi vergi beyannamesi, faturalandırma ve muhasebe kayıtlarında bağlayıcılığı yoktur; nihai mali süreçler için mali müşavirinize danışınız.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-white mb-1">4. Sorumluluk Reddi (Disclaimer)</h4>
                <p className="text-slate-400">
                  Kullanıcıların araçları kullanımından, yapılan hesaplamalardan veya elde edilen sonuçların uygulanmasından doğabilecek doğrudan veya dolaylı maddi/manevi zararlardan ToolX ve site işleticisi sorumlu tutulamaz.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'imprint' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">Künye (5651 Sayılı Kanun Madde 3 Uyarınca)</h3>
                <p className="text-slate-400 mb-3">
                  5651 Sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi Hakkında Kanun uyarınca tanıtıcı bilgiler aşağıda kamuoyunun bilgisine sunulmuştur:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="block text-[11px] text-slate-500 font-medium">Hizmet / Platform Adı</span>
                  <span className="text-xs font-semibold text-white">ToolX Hızlı Araçlar</span>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="block text-[11px] text-slate-500 font-medium">Faaliyet Niteliği</span>
                  <span className="text-xs font-semibold text-white">Kâr Amacı Gütmeyen Açık Web Araçları</span>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="block text-[11px] text-slate-500 font-medium">Alan Adı (Domain)</span>
                  <span className="text-xs font-semibold text-blue-400">toolx.com.tr</span>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="block text-[11px] text-slate-500 font-medium">İletişim & Geri Bildirim</span>
                  <a
                    href="mailto:iletisim@toolx.com.tr"
                    className="text-xs font-semibold text-blue-400 hover:underline"
                  >
                    iletisim@toolx.com.tr
                  </a>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 sm:col-span-2">
                  <span className="block text-[11px] text-slate-500 font-medium">Sunucu & Dağıtım Altyapısı</span>
                  <span className="text-xs font-semibold text-slate-300">
                    Cloudflare Pages Edge Network (Statik Barındırma)
                  </span>
                </div>
              </div>

              <div className="pt-2 text-slate-400 text-[11px]">
                <p>
                  Sitemizde doğrudan mesafeli satış veya ticari e-ticaret işlemi yapılmadığından, 6563 Sayılı Kanun gereği ETBİS kayıt zorunluluğu bulunmamaktadır.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Son güncelleme: Ekim 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
