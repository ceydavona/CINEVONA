// Baslik — sayfanın en üstünde sabit kalan navigasyon bileşeni.
// Logo ve 4 sayfa linki içerir; aktif sayfa alt çizgiyle vurgulanır.

const LINKLER = [
  { id: "kesfet",     label: "Keşfet"     },
  { id: "arsiv",      label: "Arşivim"    },
  { id: "istatistik", label: "İstatistik" },
  { id: "hakkinda",   label: "Hakkında"   },
];

export default function Baslik({ sayfa, onNavigate, arsivSayisi }) {
  return (
    <header className="sticky top-0 z-40 bg-[#F9F7F4]/95 backdrop-blur-md border-b border-black/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">

        {/* Logo */}
        <div className="flex items-center justify-center py-5 border-b border-black/[0.04]">
          <button
            onClick={() => onNavigate("kesfet")}
            className="serif text-3xl md:text-4xl tracking-tight text-[#1C1C1C] hover:opacity-50 transition-opacity"
          >
            CINEVONA
          </button>
        </div>

        {/* Navigasyon linkleri */}
        <nav className="flex items-center justify-center gap-8 h-11">
          {LINKLER.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`relative text-[11px] uppercase tracking-[0.3em] transition-all pb-0.5 ${
                sayfa === id
                  ? "text-[#1C1C1C] border-b border-[#1C1C1C]"
                  : "text-[#AAA] hover:text-[#1C1C1C]"
              }`}
            >
              {label}
              {/* Arşivim rozeti — arşiv doluysa film sayısını gösterir */}
              {id === "arsiv" && arsivSayisi > 0 && (
                <span className="absolute -top-2 -right-3.5 min-w-[16px] h-[16px] bg-[#C08080] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                  {arsivSayisi > 99 ? "99+" : arsivSayisi}
                </span>
              )}
            </button>
          ))}
        </nav>

      </div>
    </header>
  );
}