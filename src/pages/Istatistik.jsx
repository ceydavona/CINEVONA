// İstatistik sayfası — kullanıcının arşiv verisini görselleştirir.
// Tüm hesaplamalar istemci tarafında yapılır, dış veri kaynağı kullanılmaz.

const TURLER = {
  28: "Aksiyon", 12: "Macera", 16: "Animasyon", 35: "Komedi",
  80: "Suç", 99: "Belgesel", 18: "Dram", 14: "Fantastik",
  27: "Korku", 9648: "Gizem", 10749: "Romantik", 878: "Bilim Kurgu",
  53: "Gerilim", 10752: "Savaş", 37: "Vahşi Batı",
};

const RUH_HALI_MAP = {
  yalniz:    { etiket: "Yalnız",            emoji: "🌙" },
  arkadasla: { etiket: "Arkadaşlarla",       emoji: "🎉" },
  gec:       { etiket: "Geç Saatte",         emoji: "🕯️" },
  dikkatli:  { etiket: "Dikkatli İzleyerek", emoji: "🎬" },
  nostaljik: { etiket: "Nostaljik",           emoji: "📼" },
  rastgele:  { etiket: "Rastgele",            emoji: "🎲" },
};

export default function Istatistik({ arsiv, onNavigate }) {

  // Arşiv boşsa veri bekleme ekranı
  if (!arsiv || arsiv.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="serif text-4xl md:text-5xl text-[#1C1C1C] mb-6">İstatistik</h1>
        <div className="py-20 border border-dashed border-[#D4C9B8] flex flex-col items-center">
          <p className="serif italic text-2xl text-[#AAA] mb-8">Henüz yeterli veri yok.</p>
          <button
            onClick={() => onNavigate("kesfet")}
            className="text-[11px] uppercase tracking-[0.3em] text-[#1C1C1C] border border-[#1C1C1C] px-10 py-4 hover:bg-[#1C1C1C] hover:text-white transition-all"
          >
            Film Keşfetmeye Başla
          </button>
        </div>
      </div>
    );
  }

  // --- Hesaplamalar ---

  const puanlilar  = arsiv.filter(f => f.kullaniciPuani > 0);
  const ortalama   = puanlilar.length > 0
    ? (puanlilar.reduce((t, f) => t + f.kullaniciPuani, 0) / puanlilar.length).toFixed(1)
    : null;

  // En yüksek kullanıcı puanına sahip film
  const enYuksek = [...arsiv].sort((a, b) => (b.kullaniciPuani || 0) - (a.kullaniciPuani || 0))[0];
  // En son eklenen film
  const enYeni   = [...arsiv].sort((a, b) => new Date(b.eklenmeTarihi) - new Date(a.eklenmeTarihi))[0];

  // Her tür kaç filmde geçiyor → sıralı liste
  const turSayim = {};
  arsiv.forEach(f => {
    (f.genreIds || []).forEach(id => {
      turSayim[id] = (turSayim[id] || 0) + 1;
    });
  });
  const turListesi = Object.entries(turSayim)
    .filter(([id]) => TURLER[id])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id, sayi]) => ({ isim: TURLER[id], sayi }));
  const maxTur = turListesi[0]?.sayi || 1;

  // Her puan değeri (1–5) için film sayısı
  const puanDagilim = [1, 2, 3, 4, 5].map(p => ({
    puan: p,
    sayi: arsiv.filter(f => f.kullaniciPuani === p).length,
  }));
  const maxPuan = Math.max(...puanDagilim.map(p => p.sayi), 1);

  // Ruh hali etiketlerinin kullanım sıklığı
  const ruhHaliSayim = {};
  arsiv.forEach(f => {
    if (f.ruhHali) ruhHaliSayim[f.ruhHali] = (ruhHaliSayim[f.ruhHali] || 0) + 1;
  });
  const ruhHaliListesi = Object.entries(ruhHaliSayim).sort((a, b) => b[1] - a[1]);

  // Yapım yılı dağılımı (en yeni 8 yıl)
  const yilSayim = {};
  arsiv.forEach(f => {
    if (f.releaseYear && f.releaseYear !== "—")
      yilSayim[f.releaseYear] = (yilSayim[f.releaseYear] || 0) + 1;
  });
  const yilListesi = Object.entries(yilSayim)
    .sort((a, b) => b[0] - a[0])
    .slice(0, 8);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-24">

      <div className="mb-14 border-b border-[#E8E2D9] pb-8">
        <h1 className="serif text-5xl text-[#1C1C1C] mb-2">İstatistik</h1>
        <p className="text-sm text-[#999]">Sinema arşivinin sayısal portresi.</p>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E8E2D9] border border-[#E8E2D9] mb-14">
        {[
          { deger: arsiv.length,              birim: "Film",          alt: "Arşivde"         },
          { deger: ortalama ?? "—",           birim: "Ort. Puan",     alt: "Kişisel"         },
          { deger: turListesi[0]?.isim ?? "—", birim: "Favori Tür",   alt: "En çok izlenen"  },
          { deger: puanlilar.length,          birim: "Değerlendirme", alt: "Yapılan"          },
        ].map((k, i) => (
          <div key={i} className="bg-[#F9F7F4] px-6 py-8 text-center">
            <p className="serif text-4xl text-[#1C1C1C] leading-none mb-2">{k.deger}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#1C1C1C] mb-1">{k.birim}</p>
            <p className="text-[9px] uppercase tracking-widest text-[#BBB]">{k.alt}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-14">

        {/* Tür dağılımı — yatay çizgi grafik */}
        <div>
          <h2 className="serif text-2xl text-[#1C1C1C] mb-6">Tür Dağılımı</h2>
          <div className="space-y-3">
            {turListesi.map(({ isim, sayi }) => (
              <div key={isim}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] uppercase tracking-widest text-[#666]">{isim}</span>
                  <span className="serif text-sm text-[#1C1C1C]">{sayi}</span>
                </div>
                <div className="h-px bg-[#EDE8E1] w-full relative">
                  <div
                    className="absolute left-0 top-0 h-px bg-[#1C1C1C] transition-all duration-700"
                    style={{ width: `${(sayi / maxTur) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Puan dağılımı — dikey bar grafik */}
        <div>
          <h2 className="serif text-2xl text-[#1C1C1C] mb-6">Puan Dağılımı</h2>
          <div className="flex items-end gap-3 h-32">
            {puanDagilim.map(({ puan, sayi }) => (
              <div key={puan} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[11px] text-[#AAA]">{sayi}</span>
                <div
                  className="w-full bg-[#1C1C1C] transition-all duration-700"
                  style={{ height: `${sayi === 0 ? 2 : (sayi / maxPuan) * 96}px`, opacity: sayi === 0 ? 0.1 : 1 }}
                />
                <div className="flex">
                  {[...Array(puan)].map((_, i) => (
                    <span key={i} className="text-[10px] text-[#C8A97E]">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-14">

        {/* İzleme ruh hali dağılımı */}
        {ruhHaliListesi.length > 0 && (
          <div>
            <h2 className="serif text-2xl text-[#1C1C1C] mb-6">İzleme Ruh Hali</h2>
            <div className="space-y-2">
              {ruhHaliListesi.map(([id, sayi]) => {
                const bilgi = RUH_HALI_MAP[id];
                if (!bilgi) return null;
                return (
                  <div key={id} className="flex items-center justify-between py-2 border-b border-[#F0ECE4]">
                    <span className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#666]">
                      <span>{bilgi.emoji}</span> {bilgi.etiket}
                    </span>
                    <span className="serif text-sm text-[#1C1C1C]">{sayi} film</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Yapım yılı dağılımı */}
        {yilListesi.length > 0 && (
          <div>
            <h2 className="serif text-2xl text-[#1C1C1C] mb-6">Yapım Yılı</h2>
            <div className="space-y-2">
              {yilListesi.map(([yil, sayi]) => (
                <div key={yil} className="flex items-center justify-between py-2 border-b border-[#F0ECE4]">
                  <span className="text-[11px] uppercase tracking-widest text-[#666]">{yil}</span>
                  <span className="serif text-sm text-[#1C1C1C]">{sayi} film</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Son eklenen ve en yüksek puanlı film kartları */}
      <div className="grid md:grid-cols-2 gap-8">
        {[
          { baslik: "Son Eklenen",      film: enYeni   },
          { baslik: "En Yüksek Puanlı", film: enYuksek },
        ].filter(({ film }) => film).map(({ baslik, film }) => (
          <div key={baslik} className="border border-[#E8E2D9] p-6 flex gap-4">
            <div className="shrink-0 w-14 h-20 bg-[#EDE8E1] overflow-hidden">
              {film.posterURL && (
                <img src={film.posterURL} alt={film.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] text-[#AAA] mb-2">{baslik}</p>
              <h3 className="serif text-lg text-[#1C1C1C] leading-tight mb-1">{film.title}</h3>
              <p className="text-[10px] text-[#AAA] uppercase tracking-wider">{film.releaseYear}</p>
              {film.kullaniciPuani > 0 && (
                <div className="flex gap-0.5 mt-2">
                  {[1, 2, 3, 4, 5].map(y => (
                    <span key={y} className={`text-xs ${y <= film.kullaniciPuani ? "text-[#1C1C1C]" : "text-[#DDD]"}`}>★</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}