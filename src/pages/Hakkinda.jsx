// Hakkında sayfası — uygulamanın amacını ve kullanımını açıklar.

export default function Hakkinda() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 pb-24">

      <div className="mb-14 border-b border-[#E8E2D9] pb-8">
        <h1 className="serif text-5xl text-[#1C1C1C] mb-2">Hakkında</h1>
        <p className="text-sm text-[#999]">CINEVONA nedir, nasıl çalışır?</p>
      </div>

      <div className="space-y-12">

        <div>
          <h2 className="serif text-2xl text-[#1C1C1C] mb-4">Nedir?</h2>
          <p className="text-[#555] leading-[1.9] text-[0.95rem] font-light">
            CINEVONA, kişisel sinema arşivini yönetmek ve yeni filmler keşfetmek için
            tasarlanmış minimalist bir dijital günlüktür. Reklamsız, ücretsiz ve tamamen
            senin kontrolünde.
          </p>
        </div>

        <div>
          <h2 className="serif text-2xl text-[#1C1C1C] mb-4">Nasıl Çalışır?</h2>
          <div className="space-y-0">
            {[
              { no: "01", baslik: "Keşfet",      aciklama: "TMDB veritabanından popüler, vizyondaki ve türe göre filmleri incele." },
              { no: "02", baslik: "Arşivle",     aciklama: "Beğendiğin filmleri arşivine ekle. Tüm veriler tarayıcında saklanır." },
              { no: "03", baslik: "Değerlendir", aciklama: "Kendi puanını ver, izleme ruh halini etiketle, notlarını yaz." },
              { no: "04", baslik: "Analiz Et",   aciklama: "İstatistik sayfasında arşivinin sayısal portresini gör." },
            ].map(({ no, baslik, aciklama }) => (
              <div key={no} className="flex gap-6 py-6 border-b border-[#F0ECE4]">
                <span className="serif text-3xl text-[#E0D9CE] shrink-0 leading-none">{no}</span>
                <div>
                  <h3 className="serif text-lg text-[#1C1C1C] mb-1">{baslik}</h3>
                  <p className="text-sm text-[#888] font-light leading-relaxed">{aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="serif text-2xl text-[#1C1C1C] mb-4">Gizlilik</h2>
          <p className="text-[#555] leading-[1.9] text-[0.95rem] font-light">
            Hiçbir verin sunucuya gönderilmez. Arşivin, puanların ve notların yalnızca
            kendi tarayıcında saklanır. Hesap açmana gerek yok.
          </p>
        </div>

      </div>
    </div>
  );
}