# Firebase Config Bilgilerini Bulma Rehberi

## Adım 1: Firebase Console'a Giriş Yapın

1. https://console.firebase.google.com adresine gidin
2. Google hesabınızla giriş yapın

## Adım 2: Yeni Proje Oluşturun (veya Mevcut Projeyi Seçin)

1. "Add project" (Proje Ekle) butonuna tıklayın
2. Proje adını girin (örn: `templatemenu`)
3. Google Analytics'i isteğe bağlı olarak etkinleştirebilirsiniz
4. "Create project" (Proje Oluştur) butonuna tıklayın

## Adım 3: Web Uygulaması Ekleme

1. Firebase Console'da projenizi açın
2. Sol menüden **⚙️ Project Settings** (Proje Ayarları) ikonuna tıklayın
3. Sayfanın aşağısına kaydırın
4. **"Your apps"** (Uygulamalarınız) bölümünde **Web (</>)** ikonuna tıklayın
5. App nickname (Uygulama takma adı) girin (örn: `templatemenu-web`)
6. **"Register app"** (Uygulamayı Kaydet) butonuna tıklayın

## Adım 4: Config Bilgilerini Kopyalama

Firebase size bir kod bloğu gösterecek, şöyle görünür:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**Bu bilgileri kopyalayın!**

## Adım 5: Firestore Database Oluşturma

1. Sol menüden **"Firestore Database"** (veya **"Build" > "Firestore Database"**) seçin
2. **"Create database"** (Veritabanı Oluştur) butonuna tıklayın
3. **"Start in test mode"** (Test modunda başlat) seçeneğini seçin (geliştirme için)
4. Location (Konum) seçin (örn: `europe-west` veya size en yakın bölge)
5. **"Enable"** (Etkinleştir) butonuna tıklayın

## Adım 6: Güvenlik Kurallarını Ayarlama (ÖNEMLİ!)

Firestore Database sayfasında **"Rules"** (Kurallar) sekmesine gidin ve şu kuralları yapıştırın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Categories koleksiyonu - herkes okuyabilir, sadece admin yazabilir
    match /categories/{categoryId} {
      allow read: if true; // Herkes okuyabilir
      allow write: if request.auth != null; // Sadece giriş yapmış kullanıcılar yazabilir
      
      // Items alt koleksiyonu
      match /items/{itemId} {
        allow read: if true; // Herkes okuyabilir
        allow write: if request.auth != null; // Sadece giriş yapmış kullanıcılar yazabilir
      }
    }
  }
}
```

**Not:** Test modunda başlattıysanız, 30 gün sonra otomatik olarak kapatılır. Production için Authentication eklemeniz gerekir.

## Adım 7: .env.local Dosyası Oluşturma

Proje kök dizininde `.env.local` dosyası oluşturun ve Firebase config bilgilerini ekleyin:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**Önemli:** 
- `your-project`, `your-project-id` gibi değerleri kendi Firebase projenizden aldığınız gerçek değerlerle değiştirin
- Tırnak işareti (`"`) kullanmayın, sadece değerleri yazın
- Dosya adı tam olarak `.env.local` olmalı (başında nokta var)

## Adım 8: Dosyayı Kontrol Etme

`.env.local` dosyanız şöyle görünmeli:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEf1234567890
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=templatemenu.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=templatemenu-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=templatemenu-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

## Adım 9: Uygulamayı Yeniden Başlatma

`.env.local` dosyasını oluşturduktan sonra:

1. Dev server'ı durdurun (Ctrl+C)
2. `npm run dev` ile yeniden başlatın

## Sorun Giderme

### Config bilgilerini bulamıyorum
- Firebase Console > Project Settings > General sekmesine gidin
- "Your apps" bölümünde web uygulamanızı görmelisiniz
- Eğer yoksa, "Add app" > Web ikonuna tıklayarak ekleyin

### Firestore Database göremiyorum
- Sol menüden "Build" > "Firestore Database" seçin
- Eğer görünmüyorsa, Firebase Console'un üst kısmındaki menüden "Firestore Database" seçin

### Hata alıyorum
- `.env.local` dosyasının proje kök dizininde olduğundan emin olun
- Dosya adında yazım hatası olmamalı (`.env.local` tam olarak)
- Dev server'ı yeniden başlattığınızdan emin olun
- Firebase Console'da Firestore Database'in aktif olduğunu kontrol edin

