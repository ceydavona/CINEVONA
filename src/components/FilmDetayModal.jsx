// FilmDetayModal — bir filme tıklandığında açılan tam ekran modal.
// TMDB'den 4 isteği paralel çeker: detay, kadro, videolar, benzer filmler.

import { useState, useEffect } from "react";
import { getMovieDetails } from "../api/tmdb";

export default function FilmDetayModal({ film, arsivdeVar, onEkle, onKapat }) {
  const [detay,      setDetay     ] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [aktifTab,   setAktifTab  ] = useState("ozet");

  // Modal açıkken sayfa arka planını kilitler
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ESC tuşuyla kapat
  useEffect(() => {
    const tusla = (e) => e.key === "Escape" && onKapat();
    window.addEventListener("keydown", tusla);
    return () => window.removeEventListener("keydown", tusla);
  }, [onKapat]);

  // Film değiştiğinde detayları yeniden çek
  useEffect(() => {
    setYukleniyor(true);
    getMovieDetails(film.id)
      .then(setDetay)
      .catch(() => setDetay(null))
      .finally(() => setYukleniyor(false));
  }, [film.id]);

  // Detay yüklenene kadar film listesinden gelen temel veriyi kullan
  const veri    = detay ?? film;
  const arsivde = arsivdeVar(film.id);

  const sure = detay?.runtime
    ? `${Math.floor(detay.runtime / 60)}s ${detay.runtime % 60}dk`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 anim-fade-in">

      {/* Arka plan — tıklanınca kapat */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onKapat} />

      <div className="relative w-full md:max-w-5xl max-h-[92vh] bg-[#F9F7F4] overflow-y-auto anim-fade-up shadow-2xl">

        {/* Backdrop görseli */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-[#1C1C1C] shrink-0">
          {veri.backdropURL && (
            <img src={veri.backdropURL} alt="" className="w-full h-full object-cover opacity-60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F9F7F4] via-[#F9F7F4]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F9F7F4]/30 to-transparent" />
          <button
            onClick={onKapat}
            className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors text-lg"
          >
            ×
          </button>
        </div>

        <div className="px-6 md:px-10 pb-10 -mt-24 relative">

          {/* Poster + başlık satırı */}
          <div className="flex gap-6 md:gap-8 items-end mb-8">
            <div className="shrink-0 w-28 md:w-36 aspect-[2/3] bg-[#EDE8E1] overflow-hidden shadow-xl">
              {veri.posterURL && (
                <img src={veri.posterURL} alt={veri.title} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="flex-1 pb-1">
              {yukleniyor ? (
                // Yükleme sırasında iskelet göster
                <div className="space-y-3">
                  <div className="h-8 bg-[#EDE8E1] w-3/4 animate-pulse" />
                  <div className="h-4 bg-[#EDE8E1] w-1/2 animate-pulse" />
                </div>
              ) : (
                <>
                  <h2 className="serif text-3xl md:text-4xl text-[#1C1C1C] leading-tight mb-2">
                    {veri.title}
                  </h2>
                  {veri.tagline && (
                    <p className="serif italic text-[#999] text-base mb-3">"{veri.tagline}"</p>
                  )}
                  {/* Puan, yıl, süre, yönetmen */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-wider text-[#AAA]">
                    <span className="text-[#1C1C1C] font-medium">★ {veri.rating?.toFixed(1)}</span>
                    {veri.releaseYear && <span>{veri.releaseYear}</span>}
                    {sure && <span>{sure}</span>}
                    {detay?.yonetmen && <span>{detay.yonetmen}</span>}
                  </div>
                  {/* Tür etiketleri */}
                  {detay?.genres?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {detay.genres.map(g => (
                        <span key={g} className="text-[10px] uppercase tracking-widest px-3 py-1 border border-[#E0D9CE] text-[#888]">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Arşive ekle butonu */}
          <button
            onClick={() => onEkle(veri)}
            disabled={arsivde}
            className={`w-full py-3.5 text-[11px] uppercase tracking-[0.25em] font-medium mb-8 transition-all ${
              arsivde
                ? "bg-[#EDE8E1] text-[#AAA] cursor-not-allowed"
                : "bg-[#1C1C1C] text-white hover:bg-[#333]"
            }`}
          >
            {arsivde ? "✓ Arşivinde Var" : "+ Arşivime Ekle"}
          </button>

          {/* Tab navigasyonu */}
          <div className="flex gap-6 border-b border-[#E8E2D9] mb-8">
            {[
              { id: "ozet",      label: "Özet"          },
              { id: "oyuncular", label: "Oyuncular"     },
              { id: "fragman",   label: "Fragman"       },
              { id: "benzerler", label: "Benzer Filmler" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAktifTab(tab.id)}
                className={`pb-3 text-sm transition-all border-b-2 -mb-px ${
                  aktifTab === tab.id
                    ? "border-[#1C1C1C] text-[#1C1C1C]"
                    : "border-transparent text-[#AAA] hover:text-[#666]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ÖZET */}
          {aktifTab === "ozet" && (
            <div className="anim-fade-in">
              {yukleniyor ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-[#EDE8E1] animate-pulse" style={{ width: `${90 - i * 8}%` }} />
                  ))}
                </div>
              ) : (
                <p className="text-[#444] leading-[1.9] text-[0.95rem] font-light">
                  {veri.overview || "Bu film için açıklama bulunmuyor."}
                </p>
              )}
            </div>
          )}

          {/* OYUNCULAR */}
          {aktifTab === "oyuncular" && (
            <div className="anim-fade-in">
              {yukleniyor ? (
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-full aspect-square bg-[#EDE8E1] animate-pulse rounded-full" />
                      <div className="h-3 bg-[#EDE8E1] w-3/4 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : detay?.oyuncular?.length > 0 ? (
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                  {detay.oyuncular.map(o => (
                    <div key={o.id} className="flex flex-col items-center text-center">
                      <div className="w-full aspect-square bg-[#EDE8E1] overflow-hidden mb-2 rounded-full">
                        {o.foto ? (
                          <img src={o.foto} alt={o.isim} className="w-full h-full object-cover" />
                        ) : (
                          // Fotoğraf yoksa ismin baş harfini göster
                          <div className="w-full h-full flex items-center justify-center text-[#CCC] text-2xl serif">
                            {o.isim.charAt(0)}
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-[#1C1C1C] font-medium leading-tight line-clamp-2">{o.isim}</p>
                      <p className="text-[10px] text-[#AAA] leading-tight line-clamp-1 mt-0.5">{o.karakter}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="serif italic text-[#BBB] text-center py-8">Oyuncu bilgisi bulunamadı.</p>
              )}
            </div>
          )}

          {/* FRAGMAN */}
          {aktifTab === "fragman" && (
            <div className="anim-fade-in">
              {yukleniyor ? (
                <div className="aspect-video bg-[#EDE8E1] animate-pulse" />
              ) : detay?.fragmanKey ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${detay.fragmanKey}?autoplay=0&rel=0`}
                    title={`${veri.title} Fragman`}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                <p className="serif italic text-[#BBB] text-center py-8">Fragman bulunamadı.</p>
              )}
            </div>
          )}

          {/* BENZER FİLMLER */}
          {aktifTab === "benzerler" && (
            <div className="anim-fade-in">
              {yukleniyor ? (
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-[#EDE8E1] animate-pulse" />
                  ))}
                </div>
              ) : detay?.benzerFilmler?.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {detay.benzerFilmler.map(f => (
                    // Benzer filme tıklanınca modalı o filmle yenile
                    <div
                      key={f.id}
                      className="group cursor-pointer"
                      onClick={() => {
                        setDetay(null);
                        setYukleniyor(true);
                        setAktifTab("ozet");
                        getMovieDetails(f.id).then(setDetay).finally(() => setYukleniyor(false));
                      }}
                    >
                      <div className="aspect-[2/3] bg-[#EDE8E1] overflow-hidden mb-2">
                        {f.posterURL ? (
                          <img src={f.posterURL} alt={f.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#1C1C1C] line-clamp-2 leading-tight serif">{f.title}</p>
                      <p className="text-[10px] text-[#AAA] mt-0.5">{f.releaseYear}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="serif italic text-[#BBB] text-center py-8">Benzer film bulunamadı.</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}