# Production Deployment Guide

Bu rehber, uygulamayı production'a deploy etmek için gerekli adımları açıklar.

## Environment Variables (ÇOK ÖNEMLİ!)

Production'da Firebase'den veri çekebilmek için **mutlaka** aşağıdaki environment variables'ları deploy platformunuzda (Vercel, Netlify, vs.) set etmeniz gerekiyor.

### Vercel'de Environment Variables Ekleme

1. [Vercel Dashboard](https://vercel.com/dashboard) > Projenizi seçin
2. **Settings** > **Environment Variables** sekmesine gidin
3. Aşağıdaki değişkenleri ekleyin:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**Önemli:**
- Her değişken için **Production**, **Preview**, ve **Development** environment'larını seçin
- Değişkenleri ekledikten sonra **yeni bir deploy yapmanız** gerekiyor (Vercel otomatik olarak yeniden deploy edebilir)

### Netlify'da Environment Variables Ekleme

1. [Netlify Dashboard](https://app.netlify.com) > Projenizi seçin
2. **Site configuration** > **Environment variables** sekmesine gidin
3. Aşağıdaki değişkenleri ekleyin (yukarıdaki aynı değişkenler)
4. **Deploy settings** > **Build command** olarak `npm run build` olduğundan emin olun

### Firebase Config Bilgilerini Bulma

Firebase config bilgilerinizi bulmak için:

1. [Firebase Console](https://console.firebase.google.com) > Projenizi açın
2. ⚙️ **Project Settings** (Proje Ayarları) > **General** sekmesi
3. **Your apps** bölümünde web uygulamanızı bulun
4. **Config** objesindeki değerleri kopyalayın

Detaylı rehber için `FIREBASE_CONFIG_GUIDE.md` dosyasına bakın.

## Firebase Security Rules

Production'da Firestore'dan veri okumak için security rules'ları doğru ayarlanmış olmalı:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Categories - herkes okuyabilir
    match /categories/{categoryId} {
      allow read: if true; // Herkes okuyabilir
      allow write: if request.auth != null; // Sadece authenticated kullanıcılar yazabilir
      
      // Items alt koleksiyonu
      match /items/{itemId} {
        allow read: if true; // Herkes okuyabilir
        allow write: if request.auth != null; // Sadece authenticated kullanıcılar yazabilir
      }
    }
  }
}
```

**Not:** Eğer admin paneli için authentication kullanmıyorsanız, `request.auth != null` kısmını `false` yaparak write işlemlerini devre dışı bırakabilir veya başka bir authentication mekanizması kullanabilirsiniz.

## Deployment Sonrası Kontrol

Deploy işleminden sonra:

1. **Browser Console'u açın** (F12 > Console)
2. Sayfayı yenileyin
3. Şu logları görmelisiniz:
   - `✅ Firebase app initialized successfully`
   - `📡 Fetching categories from Firestore...`
   - `✅ Found X categories`
   - `✅ Successfully loaded X categories with total Y items`

Eğer hata görüyorsanız:

### ❌ "Firebase configuration is missing"
**Çözüm:** Environment variables'ları deploy platformunuzda doğru şekilde set ettiğinizden emin olun ve yeniden deploy edin.

### ❌ "Permission denied"
**Çözüm:** Firestore security rules'larını yukarıdaki gibi ayarlayın.

### ❌ "Service unavailable"
**Çözüm:** Firebase projenizin aktif olduğundan ve Firestore Database'in oluşturulduğundan emin olun.

### ❌ Environment variables undefined
**Çözüm:** 
- Vercel'de: Değişkenleri ekledikten sonra mutlaka **yeni bir deploy** yapın
- Netlify'da: **Redeploy** butonuna tıklayın
- Next.js'te `NEXT_PUBLIC_` prefix'i olmayan değişkenler client-side'da erişilemez

## Test Firebase Connection

Production'da Firebase bağlantısını test etmek için:

1. `https://your-domain.com/test-firebase` adresine gidin
2. Bağlantı durumunu kontrol edin
3. Eğer hata varsa, console'daki detaylı hata mesajlarını inceleyin

## Build and Deploy

### Vercel

```bash
# Git'e push yapın
git add .
git commit -m "Deploy to production"
git push origin main

# Vercel otomatik olarak deploy edecek
# Veya manuel deploy:
vercel --prod
```

### Netlify

```bash
# Git'e push yapın
git add .
git commit -m "Deploy to production"
git push origin main

# Netlify otomatik olarak deploy edecek
# Veya manuel deploy:
netlify deploy --prod
```

## Önemli Notlar

1. **Environment Variables Build-Time'da Inject Edilir**: Next.js'te `NEXT_PUBLIC_` prefix'li değişkenler build-time'da JavaScript bundle'a inject edilir. Bu yüzden değişkenleri değiştirdikten sonra **mutlaka yeniden build ve deploy** yapmanız gerekir.

2. **Client-Side Only**: Firebase config'i sadece client-side'da çalışır. Server-side rendering (SSR) sırasında Firebase'e erişilemez, bu normaldir.

3. **Console Logs**: Production'da browser console'u açarak Firebase bağlantı durumunu kontrol edebilirsiniz. Tüm önemli işlemler console'a loglanır.

4. **Firebase Quota**: Firebase free tier'ı kullanıyorsanız, günlük okuma/yazma limitlerini kontrol edin.
