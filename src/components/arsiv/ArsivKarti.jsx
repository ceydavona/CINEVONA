// ArsivKarti — Arşivim sayfasındaki her film satırını temsil eder.
// Güncelleme modalını (ArsivDuzenle) kendi içinde yönetir.

import { useState } from "react";
import ArsivDuzenle from "./ArsivDuzenle";

// Ruh hali ID'lerini görüntülenecek veriye dönüştürür
const RUH_HALI_MAP = {
  yalniz:    { etiket: "Yalnız",            emoji: "🌙" },
  arkadasla: { etiket: "Arkadaşlarla",       emoji: "🎉" },
  gec:       { etiket: "Geç Saatte",         emoji: "🕯️" },
  dikkatli:  { etiket: "Dikkatli İzleyerek", emoji: "🎬" },
  nostaljik: { etiket: "Nostaljik",           emoji: "📼" },
  rastgele:  { etiket: "Rastgele",            emoji: "🎲" },
};

export default function ArsivKarti({ girdi, onGuncelle, onSil, onDetay, sira = 0 }) {
  // Düzenleme modalının açık/kapalı durumu
  const [duzenliyor, setDuzenliyor] = useState(false);

  const eklenmeTarihi = new Date(girdi.eklenmeTarihi).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });

  const ruhHaliBilgi = girdi.ruhHali ? RUH_HALI_MAP[girdi.ruhHali] : null;

  return (
    <>
      <article className={`anim-fade-up delay-${Math.min(sira + 1, 5)} flex gap-5 py-6 border-b border-[#E8E2D9] group`}>

        {/* Poster — tıklanınca detay modalı açılır */}
        <div
          className="shrink-0 w-16 h-24 bg-[#EDE8E1] overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
          onClick={() => onDetay?.(girdi)}
        >
          {girdi.posterURL && (
            <img src={girdi.posterURL} alt={girdi.title} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="flex-1 min-w-0">

          {/* Başlık ve aksiyon butonları (hover'da görünür) */}
          <div className="flex items-start justify-between gap-4 mb-1">
            <h3
              className="serif text-lg leading-tight text-[#1C1C1C] cursor-pointer hover:text-[#555] transition-colors"
              onClick={() => onDetay?.(girdi)}
            >
              {girdi.title}
            </h3>
            <div className="flex items-center gap-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onDetay?.(girdi)} className="text-[11px] uppercase tracking-widest text-[#AAA] hover:text-[#1C1C1C] transition-colors">
                Detay
              </button>
              <button onClick={() => setDuzenliyor(true)} className="text-[11px] uppercase tracking-widest text-[#888] hover:text-[#1C1C1C] transition-colors">
                Düzenle
              </button>
              <button onClick={() => onSil(girdi.id)} className="text-[11px] uppercase tracking-widest text-[#C08080] hover:text-[#A05050] transition-colors">
                Sil
              </button>
            </div>
          </div>

          {/* Meta bilgileri */}
          <div className="flex items-center gap-3 text-[11px] text-[#AAA] uppercase tracking-wider mb-3">
            <span>{girdi.releaseYear}</span>
            <span>·</span>
            <span>TMDB ★ {girdi.rating?.toFixed(1)}</span>
            <span>·</span>
            <span>{eklenmeTarihi}</span>
          </div>

          {/* Kullanıcı puanı */}
          {girdi.kullaniciPuani > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((y) => (
                <span key={y} className={`text-sm ${y <= girdi.kullaniciPuani ? "text-[#1C1C1C]" : "text-[#D4C9B8]"}`}>★</span>
              ))}
              <span className="text-[11px] text-[#AAA] ml-1 uppercase tracking-wider">Benim puanım</span>
            </div>
          )}

          {/* İzleme ruh hali etiketi */}
          {ruhHaliBilgi && (
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#888] border border-[#E0D9CE] px-2.5 py-1">
                <span>{ruhHaliBilgi.emoji}</span>
                {ruhHaliBilgi.etiket}
              </span>
            </div>
          )}

          {/* Kullanıcı notu */}
          {girdi.kullaniciNotu && (
            <p className="text-sm text-[#666] italic leading-relaxed line-clamp-2 mt-1">
              "{girdi.kullaniciNotu}"
            </p>
          )}

          {/* Hiç kişisel veri yoksa düzenlemeye davet */}
          {!girdi.kullaniciPuani && !girdi.kullaniciNotu && !girdi.ruhHali && (
            <button
              onClick={() => setDuzenliyor(true)}
              className="text-[11px] text-[#BBB] hover:text-[#888] uppercase tracking-widest transition-colors"
            >
              + Puan, ruh hali ve not ekle
            </button>
          )}
        </div>
      </article>

      {/* Güncelleme modalı — yalnızca duzenliyor=true iken render edilir */}
      {duzenliyor && (
        <ArsivDuzenle
          girdi={girdi}
          onKaydet={onGuncelle}
          onKapat={() => setDuzenliyor(false)}
        />
      )}
    </>
  );
}