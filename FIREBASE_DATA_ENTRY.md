# Firebase'de Veri Ekleme Rehberi

## Yöntem 1: Admin Panelinden Ekleme (ÖNERİLEN) ✅

Bu en kolay ve önerilen yöntemdir. Admin paneli üzerinden eklediğiniz tüm veriler otomatik olarak Firebase'e kaydedilir.

### Adımlar:

1. **Admin Paneline Giriş Yapın**
   - Tarayıcıda: `http://localhost:3000/admin`
   - Şifre: `admin` veya `admin123`

2. **Kategori Eklemek**
   - "Categories" sekmesine tıklayın
   - "Add New Category" butonuna tıklayın
   - Kategori adını girin (örn: "Appetizers")
   - İkon seçin
   - "Save" butonuna tıklayın

3. **Ürün Eklemek**
   - "Menu Items" sekmesine tıklayın
   - Üst kısımdan kategori seçin
   - "Add New Item" butonuna tıklayın
   - Formu doldurun:
     - Name: Ürün adı
     - Description: Açıklama
     - Price: Fiyat
     - Tags: Etiketler (virgülle ayırın, örn: "Vegetarian, Gluten Free")
     - Image URL: (Opsiyonel) Ürün fotoğrafı URL'si
   - "Save" butonuna tıklayın

**Not:** Admin panelinden eklediğiniz tüm veriler otomatik olarak Firebase Firestore'a kaydedilir ve tüm cihazlardan görülebilir.

---

## Yöntem 2: Firebase Console'dan Manuel Ekleme

Eğer admin paneli çalışmıyorsa veya toplu veri eklemek istiyorsanız, Firebase Console'dan manuel olarak ekleyebilirsiniz.

### Veri Yapısı:

```
categories (Collection)
  └── appetizers (Document ID)
      ├── title: "Appetizers"
      ├── icon: "Leaf"
      └── items (Subcollection)
          └── item1 (Document ID)
              ├── id: 1
              ├── name: "Truffle Arancini"
              ├── description: "Crispy risotto balls..."
              ├── price: 18
              ├── tags: ["Vegetarian", "Gluten Free"]
              └── imageUrl: "https://..."
```

### Adım Adım:

#### 1. Kategori Oluşturma

1. Firebase Console > Firestore Database'e gidin
2. **"Start collection"** (Koleksiyon Başlat) butonuna tıklayın
3. Collection ID: `categories` yazın
4. **"Next"** (İleri) butonuna tıklayın
5. Document ID: Kategori ID'si girin (örn: `appetizers`, `mains`, `desserts`)
6. Alanları ekleyin:
   - Field: `title`, Type: `string`, Value: `Appetizers`
   - Field: `icon`, Type: `string`, Value: `Leaf`
7. **"Save"** (Kaydet) butonuna tıklayın

#### 2. Ürün (Item) Ekleme

1. Oluşturduğunuz kategori dokümanına tıklayın
2. **"Start subcollection"** (Alt koleksiyon başlat) butonuna tıklayın
3. Collection ID: `items` yazın
4. **"Next"** (İleri) butonuna tıklayın
5. Document ID: Otomatik ID kullanabilirsiniz veya manuel girebilirsiniz
6. Alanları ekleyin:

   **Alan 1:**
   - Field: `id`
   - Type: `number`
   - Value: `1`

   **Alan 2:**
   - Field: `name`
   - Type: `string`
   - Value: `Truffle Arancini`

   **Alan 3:**
   - Field: `description`
   - Type: `string`
   - Value: `Crispy risotto balls with black truffle and parmesan, served with aioli`

   **Alan 4:**
   - Field: `price`
   - Type: `number`
   - Value: `18`

   **Alan 5:**
   - Field: `tags`
   - Type: `array`
   - Value: `Vegetarian`, `Gluten Free` (her birini ayrı satırda ekleyin)

   **Alan 6 (Opsiyonel):**
   - Field: `imageUrl`
   - Type: `string`
   - Value: `https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop&q=80`

7. **"Save"** (Kaydet) butonuna tıklayın

#### 3. Daha Fazla Ürün Ekleme

Aynı kategorinin `items` alt koleksiyonuna daha fazla ürün eklemek için:
1. Kategori dokümanına tıklayın
2. `items` alt koleksiyonuna tıklayın
3. **"Add document"** (Doküman ekle) butonuna tıklayın
4. Yukarıdaki adımları tekrarlayın

---

## Örnek Veri Seti

Başlangıç için örnek veriler:

### Kategori 1: Appetizers
- Document ID: `appetizers`
- title: `Appetizers`
- icon: `Leaf`

**Items:**
- id: 1, name: `Truffle Arancini`, price: 18, tags: `["Vegetarian", "Gluten Free"]`
- id: 2, name: `Burrata & Prosciutto`, price: 22, tags: `[]`
- id: 3, name: `Crispy Artichoke Hearts`, price: 16, tags: `["Vegetarian"]`

### Kategori 2: Main Courses
- Document ID: `mains`
- title: `Main Courses`
- icon: `UtensilsCrossed`

**Items:**
- id: 4, name: `Pan-Seared Salmon`, price: 32, tags: `["Gluten Free"]`
- id: 5, name: `Wagyu Beef Tenderloin`, price: 68, tags: `[]`

---

## İpuçları

1. **Admin Panelini Kullanın:** En kolay ve hızlı yöntem admin panelidir. Firebase Console'dan manuel ekleme sadece gerekirse kullanın.

2. **ID'ler Önemli:** Her item'ın `id` alanı benzersiz olmalı. Admin paneli otomatik olarak en yüksek ID'yi bulup +1 ekler.

3. **Tags Array:** Tags bir array (dizi) olmalı. Firebase Console'da array eklerken her bir değeri ayrı satırda ekleyin.

4. **Image URL:** Ürün fotoğrafları için Unsplash veya başka bir görsel servis kullanabilirsiniz.

5. **Kategori ID'leri:** Kategori ID'leri küçük harf ve tire (-) ile ayrılmış olmalı (örn: `main-courses`, `appetizers`).

---

## Sorun Giderme

### Admin panelinden ekleme çalışmıyor
- Firebase config'in doğru olduğundan emin olun (`.env.local`)
- Dev server'ı yeniden başlatın
- Tarayıcı konsolunda hata var mı kontrol edin

### Firebase Console'da veri görünmüyor
- Firestore Database'in aktif olduğundan emin olun
- Doğru projeyi seçtiğinizden emin olun
- Sayfayı yenileyin

### Veriler site'de görünmüyor
- Dev server'ı yeniden başlatın
- Tarayıcı konsolunda hata var mı kontrol edin
- Firebase Console'da verilerin doğru yapıda olduğundan emin olun


