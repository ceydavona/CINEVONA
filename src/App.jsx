// Ana uygulama bileşeni — sayfa yönlendirmesini ve global state'i yönetir.

import { useState } from "react";
import { useArsiv } from "./hooks/useArsiv";
import Baslik from "./components/layout/Baslik";
import Footer from "./components/layout/Footer";
import Kesfet from "./pages/Kesfet";
import Arsivim from "./pages/Arsivim";
import Istatistik from "./pages/Istatistik";
import Hakkinda from "./pages/Hakkinda";
import FilmDetayModal from "./components/FilmDetayModal";

export default function App() {
  // Aktif sayfa: "kesfet" | "arsiv" | "istatistik" | "hakkinda"
  const [sayfa,      setSayfa     ] = useState("kesfet");
  // Detay modalında gösterilecek film, null iken modal kapalıdır
  const [seciliFilm, setSeciliFilm] = useState(null);

  const { arsiv, arsiveEkle, girdiGuncelle, arsivdenSil, arsivdeVar } = useArsiv();

  // Sayfa değiştir ve sayfayı en üste kaydır
  const navigate = (hedef) => {
    setSayfa(hedef);
    setSeciliFilm(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] flex flex-col">
      <Baslik
        sayfa={sayfa}
        onNavigate={navigate}
        arsivSayisi={arsiv.length}
      />

      <main className="flex-grow">
        {sayfa === "kesfet" && (
          <Kesfet
            arsivdeVar={arsivdeVar}
            onEkle={arsiveEkle}
            onFilmSec={setSeciliFilm}
          />
        )}
        {sayfa === "arsiv" && (
          <Arsivim
            arsiv={arsiv}
            onGuncelle={girdiGuncelle}
            onSil={arsivdenSil}
            onNavigate={navigate}
            onFilmSec={setSeciliFilm}
          />
        )}
        {sayfa === "istatistik" && (
          <Istatistik arsiv={arsiv} onNavigate={navigate} />
        )}
        {sayfa === "hakkinda" && (
          <Hakkinda />
        )}
      </main>

      <Footer onNavigate={navigate} />

      {/* Film detay modalı — yalnızca bir film seçiliyken render edilir */}
      {seciliFilm && (
        <FilmDetayModal
          film={seciliFilm}
          arsivdeVar={arsivdeVar}
          onEkle={arsiveEkle}
          onKapat={() => setSeciliFilm(null)}
        />
      )}
    </div>
  );
}