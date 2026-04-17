// FilmKarti — Keşfet sayfasındaki raf ve arama sonuçlarında kullanılan kart bileşeni.
// Poster tıklanınca detay modalı açılır; hover panelinden arşive eklenebilir.

export default function FilmKarti({ film, arsivde, onEkle, onDetay, sira = 0 }) {
  return (
    <article className={`group cursor-pointer anim-fade-up delay-${Math.min(sira + 1, 5)} flex flex-col`}>

      <div className="relative overflow-hidden bg-[#EDE8E1] aspect-[2/3] mb-3" onClick={() => onDetay?.(film)}>
        {film.posterURL ? (
          <img
            src={film.posterURL}
            alt={film.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="serif italic text-[#BBB] text-sm">Görsel yok</span>
          </div>
        )}

        {/* Hover overlay — tagline varsa onu, yoksa overview'ı göster */}
        <div className="absolute inset-0 bg-[#1C1C1C]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4">
          {film.tagline ? (
            <p className="serif italic text-white/80 text-sm leading-snug mb-4 line-clamp-3">"{film.tagline}"</p>
          ) : (
            <p className="text-white/70 text-xs font-light leading-relaxed mb-4 line-clamp-4">{film.overview}</p>
          )}
          <button
            onClick={e => { e.stopPropagation(); onEkle(film); }}
            disabled={arsivde}
            className={`w-full text-[10px] uppercase tracking-widest py-2.5 border transition-all ${
              arsivde
                ? "border-white/20 text-white/30 cursor-not-allowed"
                : "border-white/50 text-white hover:bg-white hover:text-black"
            }`}
          >
            {arsivde ? "✓ Arşivde" : "+ Arşive Ekle"}
          </button>
        </div>
      </div>

      {/* Film adı ve meta bilgisi */}
      <div className="px-0.5" onClick={() => onDetay?.(film)}>
        <h3 className="serif text-[0.95rem] leading-tight text-[#1C1C1C] mb-1 line-clamp-2 group-hover:text-[#555] transition-colors">
          {film.title}
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-[#AAA] uppercase tracking-wider">
          <span>{film.releaseYear}</span>
          <span>·</span>
          <span>★ {film.rating?.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}