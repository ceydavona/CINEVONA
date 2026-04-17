// Keşfet sayfası — TMDB'den film verilerini çeker ve kullanıcıya sunar.

import { useState, useEffect, useRef } from "react";
import { getPopularMovies, getMoviesByGenre, searchMovies } from "../api/tmdb";
import FilmKarti from "../components/kesfet/FilmKarti";

// Ana sayfada gösterilecek raflar — "popular" özel tip, diğerleri TMDB tür ID'si
const VITRIN_TURLER = [
  { id: "popular", label: "Haftanın Seçkisi", tip: "popular" },
  { id: 28,        label: "Aksiyon",           tip: "tur"     },
  { id: 18,        label: "Dram",              tip: "tur"     },
  { id: 878,       label: "Bilim Kurgu",        tip: "tur"     },
  { id: 27,        label: "Korku",             tip: "tur"     },
];

export default function Kesfet({ arsivdeVar, onEkle, onFilmSec }) {
  const [heroFilm,        setHeroFilm       ] = useState(null);
  const [aramaSorgusu,    setAramaSorgusu   ] = useState("");
  const [aramaSonuclari,  setAramaSonuclari ] = useState([]);
  const [aramaYukleniyor, setAramaYukleniyor] = useState(false);
  const [aramaSayfasi,    setAramaSayfasi   ] = useState(1);
  const [rafVerileri,     setRafVerileri    ] = useState({});
  // Her raf için scroll container referansı
  const scrollRefs = useRef({});

  // Sayfa açılışında tüm raf verilerini paralel çek (sıralı değil)
  useEffect(() => {
    const baslat = async () => {
      try {
        const [populer, ...turSonuclari] = await Promise.all([
          getPopularMovies(1),
          ...VITRIN_TURLER.filter(t => t.tip === "tur").map(t => getMoviesByGenre(t.id, 1)),
        ]);

        setHeroFilm(populer[0]);

        const turFilmleri = {};
        turFilmleri["popular"] = { films: populer, page: 1 };
        VITRIN_TURLER.filter(t => t.tip === "tur").forEach((tur, i) => {
          turFilmleri[tur.id] = { films: turSonuclari[i], page: 1 };
        });

        setRafVerileri(turFilmleri);
      } catch (e) {
        console.error("Veri yükleme hatası:", e);
      }
    };
    baslat();
  }, []);

  // Arama — kullanıcı yazmayı bıraktıktan 500ms sonra istek gönderir (debounce)
  useEffect(() => {
    if (aramaSorgusu.length === 0) {
      setAramaSonuclari([]);
      setAramaSayfasi(1);
      return;
    }
    if (aramaSorgusu.length < 3) return;

    setAramaYukleniyor(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchMovies(aramaSorgusu, 1);
        setAramaSonuclari(data);
        setAramaSayfasi(1);
      } catch (e) {
        console.error(e);
      } finally {
        setAramaYukleniyor(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [aramaSorgusu]);

  // Arama sonuçları için "Daha Fazla" fonksiyonu
  const aramaDahaFazla = async () => {
    const sonrakiSayfa = aramaSayfasi + 1;
    try {
      const ekSonuclar = await searchMovies(aramaSorgusu, sonrakiSayfa);
      setAramaSonuclari(prev => [...prev, ...ekSonuclar]);
      setAramaSayfasi(sonrakiSayfa);
    } catch (e) {
      console.error("Arama devamı yüklenemedi:", e);
    }
  };

  // Raf kaydırma — ekran genişliğinin %80'i kadar kaydır
  const kaydir = (rafId, yon) => {
    const el = scrollRefs.current[rafId];
    if (el) el.scrollBy({
      left: yon === "sol" ? -el.offsetWidth * 0.8 : el.offsetWidth * 0.8,
      behavior: "smooth",
    });
  };

  // Raf sonuna "Daha Fazla" butonuyla yeni sayfa ekle
  const rafDahaFazla = async (tur) => {
    if (tur.tip !== "tur") return;
    const sonrakiSayfa = (rafVerileri[tur.id]?.page || 1) + 1;
    const ekFilmler = await getMoviesByGenre(tur.id, sonrakiSayfa);
    setRafVerileri(prev => ({
      ...prev,
      [tur.id]: { films: [...prev[tur.id].films, ...ekFilmler], page: sonrakiSayfa },
    }));
  };

  const aramaAktif = aramaSorgusu.length > 0;

  return (
    <div className="min-h-screen pb-20 bg-[#F9F7F4]">

      {/* HERO — arama aktifken gizlenir */}
      {!aramaAktif && heroFilm && (
        <div className="relative h-[88vh] w-full overflow-hidden bg-black">
          <img src={heroFilm.backdropURL} alt="" className="hero-img w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F9F7F4] via-transparent to-transparent" />

          <div className="absolute bottom-36 left-8 md:left-20 max-w-2xl anim-fade-up">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-px bg-white/50" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-white/70">Haftalık Seçki</span>
            </div>
            <h1 className="serif text-5xl md:text-7xl text-white mb-4 leading-[0.92] tracking-tight">
              {heroFilm.title}
            </h1>
            <p className="text-white/60 text-sm font-light leading-relaxed mb-8 max-w-md line-clamp-2">
              {heroFilm.overview}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onFilmSec(heroFilm)}
                className="px-8 py-3.5 bg-white text-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#F0EDE7] transition-all font-medium"
              >
                İncele
              </button>
              <button
                onClick={() => onEkle(heroFilm)}
                disabled={arsivdeVar(heroFilm.id)}
                className={`px-8 py-3.5 border text-[11px] uppercase tracking-[0.2em] transition-all font-medium ${
                  arsivdeVar(heroFilm.id)
                    ? "border-white/30 text-white/30 cursor-not-allowed"
                    : "border-white/60 text-white hover:bg-white hover:text-black"
                }`}
              >
                {arsivdeVar(heroFilm.id) ? "✓ Arşivde" : "+ Arşive Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ARAMA ÇUBUĞU — hero üzerine biner, arama açılınca üste çıkar */}
      <div className={`max-w-[1400px] mx-auto px-6 md:px-10 relative z-20 ${!aramaAktif ? "-mt-14" : "mt-14"}`}>
        <div className="bg-white shadow-xl shadow-black/8">
          <div className="flex items-center gap-4 px-6">
            <svg className="w-5 h-5 text-[#BBB] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Kütüphanede keşfe çıkın..."
              className="w-full bg-transparent py-5 text-lg md:text-xl font-light placeholder:text-[#CCC] focus:outline-none"
              value={aramaSorgusu}
              onChange={e => setAramaSorgusu(e.target.value)}
            />
            {aramaAktif && (
              <button
                onClick={() => setAramaSorgusu("")}
                className="text-[#BBB] hover:text-[#666] transition-colors text-xl shrink-0"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mt-16">

        {/* ARAMA SONUÇLARI */}
        {aramaAktif && (
          <div className="pb-10">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#AAA] mb-8">
              {aramaYukleniyor
                ? "Aranıyor..."
                : aramaSonuclari.length > 0
                  ? `${aramaSonuclari.length} sonuç gösteriliyor`
                  : aramaSorgusu.length >= 3 ? "Sonuç bulunamadı" : "En az 3 karakter girin"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-5 gap-y-10">
              {aramaSonuclari.map((f, i) => (
                <FilmKarti key={`${f.id}-${i}`} film={f} arsivde={arsivdeVar(f.id)} onEkle={onEkle} onDetay={onFilmSec} sira={i % 5} />
              ))}
            </div>

            {/* ARAMA İÇİN DAHA FAZLA BUTONU */}
            {aramaSonuclari.length > 0 && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={aramaDahaFazla}
                  className="text-[10px] uppercase tracking-[0.3em] text-[#AAA] hover:text-[#1C1C1C] transition-all border border-[#E8E2D9] px-10 py-4 hover:border-[#1C1C1C]"
                >
                  Daha Fazla Sonuç Göster ↓
                </button>
              </div>
            )}
          </div>
        )}

        {/* TÜR RAFLARI */}
        {!aramaAktif && VITRIN_TURLER.map((tur) => (
          <section key={tur.id} className="mb-20 group/raf relative">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="serif text-3xl text-[#1C1C1C] tracking-tight">{tur.label}</h2>
              {tur.tip === "tur" && (
                <button
                  onClick={() => rafDahaFazla(tur)}
                  className="text-[10px] uppercase tracking-[0.3em] text-[#AAA] hover:text-[#1C1C1C] transition-colors"
                >
                  Daha Fazla →
                </button>
              )}
            </div>

            <div className="relative">
              {/* Sol kaydırma oku */}
              <button
                onClick={() => kaydir(tur.id, "sol")}
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-lg rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/raf:opacity-100 transition-all hover:scale-110 text-sm"
              >
                ←
              </button>

              <div
                ref={el => scrollRefs.current[tur.id] = el}
                className="flex overflow-x-auto gap-6 pb-2 no-scrollbar"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {rafVerileri[tur.id]?.films.map((f, i) => (
                  <div key={`${tur.id}-${f.id}`} className="min-w-[220px] md:min-w-[260px]" style={{ scrollSnapAlign: "start" }}>
                    <FilmKarti film={f} arsivde={arsivdeVar(f.id)} onEkle={onEkle} onDetay={onFilmSec} sira={i % 5} />
                  </div>
                ))}
              </div>

              {/* Sağ kaydırma oku */}
              <button
                onClick={() => kaydir(tur.id, "sag")}
                className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-lg rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/raf:opacity-100 transition-all hover:scale-110 text-sm"
              >
                →
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}