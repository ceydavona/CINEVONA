CINEVONA — Kişisel Sinema Arşivi ve Veri Analiz Platformu
Proje Hakkında
CINEVONA, sinema tutkunları için geliştirilmiş, minimalist tasarım ilkelerini temel alan bir dijital film ajandası ve arşiv yönetim uygulamasıdır. Kullanıcıların TMDB (The Movie Database) veritabanı üzerinden kapsamlı film keşifleri yapmalarına, kişisel koleksiyonlarını oluşturmalarına ve izleme alışkanlıklarını sayısal verilerle analiz etmelerine olanak tanır.

Uygulama, modern web teknolojileri kullanılarak, akademik bir proje gereksinimlerini (bknz: Proje Yönergesi) karşılayacak ve aşacak şekilde kurgulanmıştır.

Temel Fonksiyonlar
Dinamik Keşif ve Arama: TMDB API entegrasyonu ile popüler, vizyondaki ve tür bazlı filmleri anlık olarak listeler. Arama motoru, performans optimizasyonu amacıyla Debounce mekanizması ile güçlendirilmiştir.

Kapsamlı Arşiv Yönetimi (CRUD): Filmleri kişisel arşive ekleme, listeleme, puanlama (1-5 yıldız), detaylı notlar ekleme ve izleme ruh hali (mood) etiketleme özelliklerini eksiksiz sunar.

İleri Düzey Veri Görselleştirme: Arşivlenen verileri istemci tarafında analiz ederek, tür dağılımı, puanlama trendleri, izleme ruh hali frekansı ve yapım yılı istatistiklerini interaktif grafiklerle sunar.

Gizlilik ve Veri Güvenliği Odaklı Mimari: Kullanıcı gizliliğini en üst düzeyde tutmak amacıyla, hiçbir veri sunucu tarafına gönderilmez. Tüm koleksiyon ve kişisel veriler, yalnızca kullanıcının kendi tarayıcısında LocalStorage teknolojisi ile saklanır.

Modern UI/UX Tasarımı: React 19 ve Tailwind CSS 4 kullanılarak, tipografi odaklı, minimalist ve kullanıcı deneyimini ön plana çıkaran bir arayüz tasarlanmıştır.

Teknik Yığın (Tech Stack)
Frontend Framework: React 19, Vite

Styling & Design: Tailwind CSS 4

Durum Yönetimi (State Management): React Hooks (Özel Hook: useArsiv)

Veri Kaynağı: TMDB API (The Movie Database)

Dağıtım (Deployment): Netlify

Proje Yapısı
Proje, akademik yönergede belirtilen modüler yapı standartlarına uygun olarak kurgulanmıştır:

src/api/: TMDB entegrasyonu ve veri normalizasyonu işlemlerini yürütür.

src/hooks/: İş mantığı (logic) ve LocalStorage senkronizasyonunu yönetir.

src/components/: Atomik ve tekrar kullanılabilir bileşenleri (Card, Modal, Layout) içerir.

src/pages/: Uygulamanın ana görünümlerini (Keşfet, Arşiv, İstatistik) barındırır.

src/interfaces/: Veri modelleri ve şablon yapılarını tanımlar (Planlanan yapısal klasör).

Kurulum ve Çalıştırma
Repoyu yerel makinenize klonlayın: git clone https://github.com/ceyda-vona/cinevona.git

Gerekli bağımlılıkları yükleyin: npm install

TMDB API anahtarınızı güvenli bir şekilde .env dosyasına ekleyin (API anahtarları kaynak kodda tutulmamalıdır).

Geliştirme sunucusunu başlatın: npm run dev

Lisans
Bu proje MIT lisansı altında lisanslanmıştır.