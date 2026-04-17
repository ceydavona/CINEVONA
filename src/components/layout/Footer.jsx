// Footer — her sayfanın altında görünen site dipnotu.
// Navigasyon linkleri, veri kaynağı notu ve telif hakkı bilgisi içerir.

const YIL = new Date().getFullYear();

const SAYFALAR = [
  { id: "kesfet",     label: "Keşfet"     },
  { id: "arsiv",      label: "Arşivim"    },
  { id: "istatistik", label: "İstatistik" },
  { id: "hakkinda",   label: "Hakkında"   },
];

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-[#E8E2D9] bg-[#F4F0EA] mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Marka */}
          <div>
            <button onClick={() => onNavigate("kesfet")} className="serif text-2xl tracking-tight text-[#1C1C1C] hover:opacity-50 transition-opacity mb-4 block">
              CINEVONA
            </button>
            <p className="text-[11px] text-[#AAA] leading-loose uppercase tracking-wider">
              Kişisel sinema arşivi. Reklamsız. Hesapsız. Seninle.
            </p>
          </div>

          {/* Sayfa linkleri */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.45em] text-[#CCC] mb-5">Sayfalar</p>
            <nav className="flex flex-col gap-3">
              {SAYFALAR.map(({ id, label }) => (
                <button key={id} onClick={() => onNavigate(id)} className="text-[11px] uppercase tracking-widest text-[#888] hover:text-[#1C1C1C] transition-colors text-left w-fit">
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Veri kaynağı ve gizlilik notu */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.45em] text-[#CCC] mb-5">Veri Kaynağı</p>
            <p className="text-[11px] text-[#AAA] leading-loose mb-3">
              Film verileri <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#1C1C1C] underline underline-offset-2 transition-colors">TMDB</a> tarafından sağlanmaktadır.
            </p>
            <p className="text-[11px] text-[#AAA] leading-loose">
              Arşiv verilerin yalnızca tarayıcında saklanır.
            </p>
          </div>

        </div>
      </div>

      {/* Alt çizgi */}
      <div className="border-t border-[#E0D9CE]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-11 flex items-center justify-between">
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#CCC]">© {YIL} CINEVONA</p>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#CCC]">Tüm Hakları Saklıdır</p>
        </div>
      </div>
    </footer>
  );
}