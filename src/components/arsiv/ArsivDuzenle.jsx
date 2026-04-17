// ArsivDuzenle — arşivdeki bir filmin puan, ruh hali ve notunu güncelleyen modal.
// Değişiklikler kaydedilene kadar yerel state'te tutulur; "Kaydet" ile useArsiv'e iletilir.

import { useState, useEffect } from "react";

const RUH_HALLERI = [
  { id: "yalniz",    etiket: "Yalnız",            emoji: "🌙" },
  { id: "arkadasla", etiket: "Arkadaşlarla",       emoji: "🎉" },
  { id: "gec",       etiket: "Geç Saatte",         emoji: "🕯️" },
  { id: "dikkatli",  etiket: "Dikkatli İzleyerek", emoji: "🎬" },
  { id: "nostaljik", etiket: "Nostaljik",           emoji: "📼" },
  { id: "rastgele",  etiket: "Rastgele",            emoji: "🎲" },
];

export default function ArsivDuzenle({ girdi, onKaydet, onKapat }) {
  const [puan,    setPuan   ] = useState(girdi.kullaniciPuani ?? 0);
  const [not,     setNot    ] = useState(girdi.kullaniciNotu  ?? "");
  const [ruhHali, setRuhHali] = useState(girdi.ruhHali        ?? null);
  const [hover,   setHover  ] = useState(0);

  // ESC tuşuyla kapat
  useEffect(() => {
    const tusla = (e) => e.key === "Escape" && onKapat();
    window.addEventListener("keydown", tusla);
    return () => window.removeEventListener("keydown", tusla);
  }, [onKapat]);

  const handleKaydet = () => {
    onKaydet(girdi.id, {
      kullaniciPuani: puan,
      kullaniciNotu:  not.trim(),
      ruhHali:        ruhHali,
    });
    onKapat();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade-in">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onKapat} />

      <div className="relative bg-[#F9F7F4] w-full max-w-md shadow-2xl p-8 anim-fade-up">

        <p className="text-[10px] uppercase tracking-[0.35em] text-[#AAA] mb-1">Küratör Notu</p>
        <h2 className="serif text-2xl leading-tight text-[#1C1C1C] mb-8">{girdi.title}</h2>

        {/* Yıldız puanı */}
        <div className="mb-6">
          <label className="block text-[11px] uppercase tracking-widest text-[#888] mb-3">Kişisel Puanım</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((yildiz) => (
              <button
                key={yildiz}
                onMouseEnter={() => setHover(yildiz)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setPuan(yildiz)}
                className={`text-2xl transition-all duration-150 ${
                  yildiz <= (hover || puan) ? "text-[#1C1C1C] scale-110" : "text-[#D4C9B8]"
                }`}
              >
                ★
              </button>
            ))}
            {puan > 0 && (
              <button
                onClick={() => setPuan(0)}
                className="text-[10px] text-[#CCC] hover:text-[#999] uppercase tracking-widest ml-2 self-center transition-colors"
              >
                Sıfırla
              </button>
            )}
          </div>
        </div>

        {/* Ruh hali seçimi — aynı seçeneğe tekrar basınca seçimi kaldırır */}
        <div className="mb-6">
          <label className="block text-[11px] uppercase tracking-widest text-[#888] mb-3">İzleme Ruh Hali</label>
          <div className="grid grid-cols-3 gap-2">
            {RUH_HALLERI.map((rh) => (
              <button
                key={rh.id}
                onClick={() => setRuhHali(ruhHali === rh.id ? null : rh.id)}
                className={`flex items-center gap-2 px-3 py-2.5 border text-left transition-all ${
                  ruhHali === rh.id
                    ? "border-[#1C1C1C] bg-[#1C1C1C] text-white"
                    : "border-[#E0D9CE] text-[#666] hover:border-[#1C1C1C]"
                }`}
              >
                <span className="text-base leading-none">{rh.emoji}</span>
                <span className="text-[10px] uppercase tracking-wider leading-tight">{rh.etiket}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Serbest metin notu */}
        <div className="mb-8">
          <label className="block text-[11px] uppercase tracking-widest text-[#888] mb-3">Notum</label>
          <textarea
            value={not}
            onChange={(e) => setNot(e.target.value)}
            placeholder="Bu film hakkında ne düşünüyorsun?"
            rows={3}
            className="w-full bg-[#F0EDE7] border-0 outline-none resize-none p-4 text-sm text-[#1C1C1C] placeholder:text-[#BBB] leading-relaxed focus:ring-1 focus:ring-[#C8B9A4]"
          />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleKaydet} className="flex-1 bg-[#1C1C1C] text-[#F9F7F4] text-[11px] uppercase tracking-widest py-3 hover:bg-[#333] transition-colors">
            Kaydet
          </button>
          <button onClick={onKapat} className="px-6 py-3 text-[11px] uppercase tracking-widest text-[#888] border border-[#E0D9CE] hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-all">
            Vazgeç
          </button>
        </div>

      </div>
    </div>
  );
}