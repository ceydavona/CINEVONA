// Arşivim sayfası — kullanıcının kaydettiği filmleri listeler.
// CRUD işlemlerinin Read kısmıdır; güncelleme ve silme ArsivKarti bileşeninden tetiklenir.

import ArsivKarti from "../components/arsiv/ArsivKarti";

export default function Arsivim({ arsiv, onGuncelle, onSil, onNavigate, onFilmSec }) {

  // Arşiv boşsa yönlendirme ekranı göster
  if (!arsiv || arsiv.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="serif text-4xl md:text-5xl text-[#1C1C1C] mb-6">Arşivim</h1>
        <div className="py-20 border border-dashed border-[#D4C9B8] flex flex-col items-center">
          <p className="serif italic text-2xl text-[#AAA] mb-8">Henüz hiçbir film eklenmedi.</p>
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

  // Yalnızca kullanıcı puanı verilmiş filmlerden ortalama hesapla
  const puanliFilmler = arsiv.filter(g => g.kullaniciPuani > 0);
  const ortalamaPuan  = puanliFilmler.length > 0
    ? (puanliFilmler.reduce((t, g) => t + g.kullaniciPuani, 0) / puanliFilmler.length).toFixed(1)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Sayfa başlığı ve özet istatistikler */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E2D9] pb-8">
        <div>
          <h1 className="serif text-5xl text-[#1C1C1C] mb-3">Arşivim</h1>
          <p className="text-sm text-[#999] tracking-wide">Kişisel sinema günlüğün ve koleksiyonun.</p>
        </div>
        <div className="flex items-center gap-12">
          <div className="text-center">
            <p className="serif text-4xl text-[#1C1C1C] leading-none">{arsiv.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#AAA] mt-2">Film</p>
          </div>
          {ortalamaPuan && (
            <div className="text-center border-l border-[#E8E2D9] pl-12">
              <p className="serif text-4xl text-[#1C1C1C] leading-none">★ {ortalamaPuan}</p>
              <p className="text-[10px] uppercase tracking-widest text-[#AAA] mt-2">Ort. Puanım</p>
            </div>
          )}
        </div>
      </div>

      {/* Film listesi */}
      <div>
        {arsiv.map((girdi, i) => (
          <ArsivKarti
            key={girdi.id}
            girdi={girdi}
            onGuncelle={onGuncelle}
            onSil={onSil}
            onDetay={onFilmSec}
            sira={i}
          />
        ))}
      </div>
    </div>
  );
}