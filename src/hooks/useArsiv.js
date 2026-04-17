// useArsiv — tüm CRUD işlemlerini ve LocalStorage senkronizasyonunu yönetir.
// Uygulama genelinde tek bir arşiv state'i vardır; bu hook App.jsx'te çağrılır
// ve ilgili fonksiyonlar prop olarak aşağı iletilir.

import { useState, useCallback } from "react";

const DEPOLAMA_ANAHTARI = "cinevona_v1";

// Sayfa yüklendiğinde LocalStorage'dan mevcut arşivi oku
const yukle = () => {
  try {
    const veri = localStorage.getItem(DEPOLAMA_ANAHTARI);
    return veri ? JSON.parse(veri) : [];
  } catch {
    // Bozuk veri durumunda boş arşivle başla
    return [];
  }
};

// Arşivi LocalStorage'a yaz
const kaydet = (girdiler) => {
  localStorage.setItem(DEPOLAMA_ANAHTARI, JSON.stringify(girdiler));
};

export function useArsiv() {
  // useState'e fonksiyon geçmek "lazy initialization" sağlar —
  // yukle() yalnızca ilk render'da çalışır
  const [arsiv, setArsiv] = useState(yukle);

  // Tüm state güncellemeleri bu merkezi yardımcıdan geçer;
  // her değişiklikte LocalStorage otomatik senkronize edilir
  const guncelle = useCallback((guncelleyici) => {
    setArsiv((onceki) => {
      const sonraki = guncelleyici(onceki);
      kaydet(sonraki);
      return sonraki;
    });
  }, []);

  // CREATE — Yeni film ekle (aynı ID varsa ekleme)
  const arsiveEkle = useCallback((film) => {
    guncelle((onceki) => {
      if (onceki.find((g) => g.id === film.id)) return onceki;
      return [{
        ...film,
        eklenmeTarihi: new Date().toISOString(),
        kullaniciPuani: 0,
        kullaniciNotu:  "",
        ruhHali:        null,
      }, ...onceki];
    });
  }, [guncelle]);

  // UPDATE — Belirtilen ID'li girdiyi kısmi veriyle güncelle
  const girdiGuncelle = useCallback((id, degisiklik) => {
    guncelle((onceki) =>
      onceki.map((g) => (g.id === id ? { ...g, ...degisiklik } : g))
    );
  }, [guncelle]);

  // DELETE — Belirtilen ID'li girdiyi arşivden kaldır
  const arsivdenSil = useCallback((id) => {
    guncelle((onceki) => onceki.filter((g) => g.id !== id));
  }, [guncelle]);

  // READ yardımcısı — film zaten arşivde mi kontrol et
  const arsivdeVar = useCallback(
    (id) => arsiv.some((g) => g.id === id),
    [arsiv]
  );

  return { arsiv, arsiveEkle, girdiGuncelle, arsivdenSil, arsivdeVar };
}