// TMDB API entegrasyonu — tüm dış veri istekleri bu dosyadan geçer
// Belge: https://developer.themoviedb.org/docs

const BASE   = "https://api.themoviedb.org/3";
const KEY    = "aceca973c4086c1ac2bf0fac21e4fb7c";
const POSTER = "https://image.tmdb.org/t/p/w500";
const BACK   = "https://image.tmdb.org/t/p/w1280";

// Ortak fetch yardımcısı — her isteğe api_key ve dil ekler
const req = async (path, params = {}) => {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", KEY);
  url.searchParams.set("language", "tr-TR");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
};

// Ham TMDB verisini uygulama içinde kullanılan formata dönüştürür
const normalize = (m) => ({
  id:          m.id,
  title:       m.title,
  overview:    m.overview || "",
  tagline:     m.tagline  || "",
  rating:      m.vote_average ?? 0,
  voteCount:   m.vote_count   ?? 0,
  releaseYear: m.release_date?.slice(0, 4) ?? "—",
  runtime:     m.runtime ?? null,
  posterURL:   m.poster_path   ? `${POSTER}${m.poster_path}`  : null,
  backdropURL: m.backdrop_path ? `${BACK}${m.backdrop_path}`  : null,
  genreIds:    m.genre_ids     ?? [],
  genres:      m.genres?.map(g => g.name) ?? [],
});

// Liste uç noktaları
export const getPopularMovies    = async (page = 1) =>
  (await req("/movie/popular",     { page })).results.map(normalize);

export const getTopRatedMovies   = async (page = 1) =>
  (await req("/movie/top_rated",   { page })).results.map(normalize);

export const getNowPlayingMovies = async (page = 1) =>
  (await req("/movie/now_playing", { page })).results.map(normalize);

export const searchMovies = async (query, page = 1) =>
  (await req("/search/movie", { query, page })).results.map(normalize);

export const getMoviesByGenre = async (genreId, page = 1) =>
  (await req("/discover/movie", { with_genres: genreId, sort_by: "popularity.desc", page }))
    .results.map(normalize);

// Tek film detayı — 4 isteği paralel atar: detay, kadro, videolar, benzerler
export const getMovieDetails = async (id) => {
  const [detay, krediler, videolar, benzerler] = await Promise.all([
    req(`/movie/${id}`),
    req(`/movie/${id}/credits`),
    req(`/movie/${id}/videos`),
    req(`/movie/${id}/similar`),
  ]);

  // Önce Türkçe fragmanı bul, yoksa ilk YouTube videosunu al
  const fragman = videolar.results?.find(
    v => v.type === "Trailer" && v.site === "YouTube"
  ) ?? videolar.results?.[0] ?? null;

  return {
    ...normalize(detay),
    yonetmen:     krediler.crew?.find(k => k.job === "Director")?.name ?? null,
    oyuncular:    krediler.cast?.slice(0, 8).map(o => ({
      id:       o.id,
      isim:     o.name,
      karakter: o.character,
      foto:     o.profile_path ? `https://image.tmdb.org/t/p/w185${o.profile_path}` : null,
    })) ?? [],
    fragmanKey:    fragman?.key ?? null,
    benzerFilmler: benzerler.results?.slice(0, 8).map(normalize) ?? [],
  };
};

// Tür ID → Türkçe isim eşlemesi (istatistik sayfasında kullanılır)
export const GENRES = {
  28: "Aksiyon", 12: "Macera", 16: "Animasyon", 35: "Komedi",
  80: "Suç", 99: "Belgesel", 18: "Dram", 10751: "Aile",
  14: "Fantastik", 36: "Tarih", 27: "Korku", 10402: "Müzik",
  9648: "Gizem", 10749: "Romantik", 878: "Bilim Kurgu",
  53: "Gerilim", 10752: "Savaş", 37: "Vahşi Batı",
};