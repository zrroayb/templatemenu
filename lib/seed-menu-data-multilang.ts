// Seed function to populate Firebase with multilingual sample menu data
'use client'

import { addCategory, addMenuItem, getMenuData, type Translations } from './menu-data'

interface MultilingualItem {
  name: Translations
  description: Translations
  price: number
  tags: { en: string[], tr: string[], ru: string[] }
  imageUrl?: string
}

interface MultilingualCategory {
  id: string
  title: Translations
  icon: string
  items: MultilingualItem[]
}

export const sampleMenuDataMultilingual: MultilingualCategory[] = [
  {
    id: 'appetizers',
    title: {
      en: 'Appetizers',
      tr: 'Başlangıçlar',
      ru: 'Закуски'
    },
    icon: 'Leaf',
    items: [
      {
        name: {
          en: 'Truffle Arancini',
          tr: 'Trüflü Arancini',
          ru: 'Аранчини с трюфелем'
        },
        description: {
          en: 'Crispy risotto balls with black truffle and parmesan, served with aioli',
          tr: 'Siyah trüfle ve parmesanlı çıtır risotto topları, aioli ile servis edilir',
          ru: 'Хрустящие шарики ризотто с черным трюфелем и пармезаном, подается с айоли'
        },
        price: 18,
        tags: {
          en: ['Vegetarian', 'Gluten Free'],
          tr: ['Vejetaryen', 'Glutensiz'],
          ru: ['Вегетарианское', 'Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Burrata & Prosciutto',
          tr: 'Burrata ve Prosciutto',
          ru: 'Буррата и Прошутто'
        },
        description: {
          en: 'Creamy burrata cheese with aged prosciutto, arugula, and balsamic glaze',
          tr: 'Kremalı burrata peyniri, yaşlı prosciutto, roka ve balzamik sos ile',
          ru: 'Сливочный сыр буррата со зрелым прошутто, рукколой и бальзамическим соусом'
        },
        price: 22,
        tags: {
          en: [],
          tr: [],
          ru: []
        },
        imageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Crispy Artichoke Hearts',
          tr: 'Çıtır Enginar Kalbi',
          ru: 'Хрустящие артишоки'
        },
        description: {
          en: 'Golden fried artichoke hearts with lemon aioli and fresh herbs',
          tr: 'Altın sarısı kızarmış enginar kalpleri, limon aioli ve taze otlarla',
          ru: 'Золотистые жареные артишоки с лимонным айоли и свежими травами'
        },
        price: 16,
        tags: {
          en: ['Vegetarian'],
          tr: ['Vejetaryen'],
          ru: ['Вегетарианское']
        },
        imageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Tuna Tartare',
          tr: 'Ton Balığı Tartar',
          ru: 'Тартар из тунца'
        },
        description: {
          en: 'Fresh yellowfin tuna with avocado, cucumber, and yuzu dressing',
          tr: 'Taze sarı yüzgeçli ton balığı, avokado, salatalık ve yuzu sos ile',
          ru: 'Свежий желтоперый тунец с авокадо, огурцом и соусом юдзу'
        },
        price: 24,
        tags: {
          en: ['Gluten Free'],
          tr: ['Glutensiz'],
          ru: ['Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Wagyu Beef Carpaccio',
          tr: 'Wagyu Dana Carpaccio',
          ru: 'Карпаччо из мраморной говядины'
        },
        description: {
          en: 'Thinly sliced wagyu beef with arugula, parmesan, and truffle oil',
          tr: 'İnce dilimlenmiş wagyu dana eti, roka, parmesan ve trüf yağı ile',
          ru: 'Тонко нарезанная мраморная говядина с рукколой, пармезаном и трюфельным маслом'
        },
        price: 28,
        tags: {
          en: ['Gluten Free'],
          tr: ['Glutensiz'],
          ru: ['Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'main-courses',
    title: {
      en: 'Main Courses',
      tr: 'Ana Yemekler',
      ru: 'Основные блюда'
    },
    icon: 'UtensilsCrossed',
    items: [
      {
        name: {
          en: 'Pan-Seared Salmon',
          tr: 'Tavada Sotelenmiş Somon',
          ru: 'Лосось, обжаренный на сковороде'
        },
        description: {
          en: 'Atlantic salmon with roasted vegetables, quinoa, and lemon butter sauce',
          tr: 'Atlantik somonu, kavrulmuş sebzeler, kinoa ve limonlu tereyağlı sos ile',
          ru: 'Атлантический лосось с жареными овощами, киноа и лимонно-сливочным соусом'
        },
        price: 32,
        tags: {
          en: ['Gluten Free'],
          tr: ['Glutensiz'],
          ru: ['Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Wagyu Beef Tenderloin',
          tr: 'Wagyu Dana Bonfile',
          ru: 'Филе мраморной говядины'
        },
        description: {
          en: 'Premium wagyu tenderloin with truffle mashed potatoes and red wine reduction',
          tr: 'Premium wagyu bonfile, trüflü püre patates ve kırmızı şarap sosu ile',
          ru: 'Премиум филе мраморной говядины с трюфельным пюре и соусом из красного вина'
        },
        price: 68,
        tags: {
          en: [],
          tr: [],
          ru: []
        },
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Herb-Crusted Lamb Chops',
          tr: 'Otlu Kuzu Pirzola',
          ru: 'Отбивные из баранины в травах'
        },
        description: {
          en: 'Rack of lamb with rosemary, garlic, roasted root vegetables, and mint jus',
          tr: 'Biberiye, sarımsak, kavrulmuş kök sebzeler ve naneli sos ile kuzu pirzola',
          ru: 'Бараньи отбивные с розмарином, чесноком, жареными корнеплодами и мятным соусом'
        },
        price: 42,
        tags: {
          en: ['Gluten Free'],
          tr: ['Glutensiz'],
          ru: ['Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Wild Mushroom Risotto',
          tr: 'Yabani Mantarlı Risotto',
          ru: 'Ризотто с дикими грибами'
        },
        description: {
          en: 'Creamy arborio rice with mixed wild mushrooms, truffle oil, and parmesan',
          tr: 'Karışık yabani mantarlı, trüf yağı ve parmesanlı kremalı arborio pilavı',
          ru: 'Сливочный рис арборио со смесью диких грибов, трюфельным маслом и пармезаном'
        },
        price: 26,
        tags: {
          en: ['Vegetarian', 'Gluten Free'],
          tr: ['Vejetaryen', 'Glutensiz'],
          ru: ['Вегетарианское', 'Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Grilled Sea Bass',
          tr: 'Izgara Levrek',
          ru: 'Жареный морской окунь'
        },
        description: {
          en: 'Mediterranean sea bass with fennel, olives, cherry tomatoes, and white wine sauce',
          tr: 'Rezene, zeytin, cherry domates ve beyaz şarap sosu ile Akdeniz levreği',
          ru: 'Средиземноморский морской окунь с фенхелем, оливками, помидорами черри и белым вином'
        },
        price: 34,
        tags: {
          en: ['Gluten Free'],
          tr: ['Glutensiz'],
          ru: ['Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Duck Confit',
          tr: 'Kaz Yahnisi',
          ru: 'Конфи из утки'
        },
        description: {
          en: 'Slow-cooked duck leg with cherry sauce, roasted potatoes, and seasonal greens',
          tr: 'Yavaş pişmiş ördek butu, vişne sosu, kavrulmuş patates ve mevsim yeşillikleri ile',
          ru: 'Медленно приготовленная утиная ножка с вишневым соусом, жареным картофелем и сезонной зеленью'
        },
        price: 38,
        tags: {
          en: [],
          tr: [],
          ru: []
        },
        imageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=400&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'desserts',
    title: {
      en: 'Desserts',
      tr: 'Tatlılar',
      ru: 'Десерты'
    },
    icon: 'Sparkles',
    items: [
      {
        name: {
          en: 'Chocolate Soufflé',
          tr: 'Çikolatalı Sufle',
          ru: 'Шоколадное суфле'
        },
        description: {
          en: 'Warm dark chocolate soufflé with vanilla ice cream and fresh berries',
          tr: 'Sıcak bitter çikolatalı sufle, vanilyalı dondurma ve taze meyvelerle',
          ru: 'Теплое суфле из темного шоколада с ванильным мороженым и свежими ягодами'
        },
        price: 16,
        tags: {
          en: ['Vegetarian'],
          tr: ['Vejetaryen'],
          ru: ['Вегетарианское']
        },
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Tiramisu',
          tr: 'Tiramisu',
          ru: 'Тирамису'
        },
        description: {
          en: 'Classic Italian tiramisu with espresso-soaked ladyfingers and mascarpone',
          tr: 'Espresso ile ıslatılmış ladyfinger ve mascarpone ile klasik İtalyan tiramisu',
          ru: 'Классический итальянский тирамису с пропитанными эспрессо дамскими пальчиками и маскарпоне'
        },
        price: 14,
        tags: {
          en: ['Vegetarian'],
          tr: ['Vejetaryen'],
          ru: ['Вегетарианское']
        },
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Lemon Tart',
          tr: 'Limonlu Tart',
          ru: 'Лимонный тарт'
        },
        description: {
          en: 'Tangy lemon curd tart with meringue and candied lemon zest',
          tr: 'Ekşi limonlu kremalı tart, beze ve şekerli limon kabuğu ile',
          ru: 'Пикантный лимонный тарт с меренгой и засахаренной цедрой лимона'
        },
        price: 13,
        tags: {
          en: ['Vegetarian', 'Gluten Free'],
          tr: ['Vejetaryen', 'Glutensiz'],
          ru: ['Вегетарианское', 'Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Crème Brûlée',
          tr: 'Krem Brule',
          ru: 'Крем-брюле'
        },
        description: {
          en: 'Vanilla bean crème brûlée with caramelized sugar and fresh fruit',
          tr: 'Vanilya çekirdekli krem brule, karamelize şeker ve taze meyvelerle',
          ru: 'Крем-брюле из ванильной фасоли с карамелизированным сахаром и свежими фруктами'
        },
        price: 12,
        tags: {
          en: ['Vegetarian', 'Gluten Free'],
          tr: ['Vejetaryen', 'Glutensiz'],
          ru: ['Вегетарианское', 'Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Berry Pavlova',
          tr: 'Meyveli Pavlova',
          ru: 'Павлова с ягодами'
        },
        description: {
          en: 'Crispy meringue with fresh seasonal berries, whipped cream, and mint',
          tr: 'Taze mevsim meyveleri, çırpılmış krema ve nane ile çıtır beze',
          ru: 'Хрустящий меренг со свежими сезонными ягодами, взбитыми сливками и мятой'
        },
        price: 15,
        tags: {
          en: ['Vegetarian', 'Gluten Free'],
          tr: ['Vejetaryen', 'Glutensiz'],
          ru: ['Вегетарианское', 'Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'beverages',
    title: {
      en: 'Beverages',
      tr: 'İçecekler',
      ru: 'Напитки'
    },
    icon: 'Coffee',
    items: [
      {
        name: {
          en: 'Espresso',
          tr: 'Espresso',
          ru: 'Эспрессо'
        },
        description: {
          en: 'Rich and bold single shot espresso',
          tr: 'Zengin ve güçlü tek shot espresso',
          ru: 'Насыщенный и крепкий одинарный эспрессо'
        },
        price: 4,
        tags: {
          en: ['Vegetarian', 'Vegan', 'Gluten Free'],
          tr: ['Vejetaryen', 'Vegan', 'Glutensiz'],
          ru: ['Вегетарианское', 'Веганское', 'Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Cappuccino',
          tr: 'Kapuçino',
          ru: 'Капучино'
        },
        description: {
          en: 'Espresso with steamed milk and velvety foam',
          tr: 'Buharda ısıtılmış süt ve kadifemsi köpük ile espresso',
          ru: 'Эспрессо с пропаренным молоком и бархатистой пеной'
        },
        price: 5,
        tags: {
          en: ['Vegetarian', 'Gluten Free'],
          tr: ['Vejetaryen', 'Glutensiz'],
          ru: ['Вегетарианское', 'Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Fresh Orange Juice',
          tr: 'Taze Portakal Suyu',
          ru: 'Свежевыжатый апельсиновый сок'
        },
        description: {
          en: 'Freshly squeezed orange juice, served chilled',
          tr: 'Taze sıkılmış portakal suyu, soğuk servis edilir',
          ru: 'Свежевыжатый апельсиновый сок, подается охлажденным'
        },
        price: 6,
        tags: {
          en: ['Vegetarian', 'Vegan', 'Gluten Free'],
          tr: ['Vejetaryen', 'Vegan', 'Glutensiz'],
          ru: ['Вегетарианское', 'Веганское', 'Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Craft Cocktail Selection',
          tr: 'El Yapımı Kokteyl Seçkisi',
          ru: 'Коллекция крафтовых коктейлей'
        },
        description: {
          en: 'Ask your server for our seasonal craft cocktail menu',
          tr: 'Mevsimsel el yapımı kokteyl menümüz için garsonunuza danışın',
          ru: 'Спросите у официанта о нашем сезонном меню крафтовых коктейлей'
        },
        price: 14,
        tags: {
          en: [],
          tr: [],
          ru: []
        },
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Wine Selection',
          tr: 'Şarap Seçkisi',
          ru: 'Подборка вин'
        },
        description: {
          en: 'Curated selection of red, white, and rosé wines',
          tr: 'Kırmızı, beyaz ve rosé şarapların özenle seçilmiş koleksiyonu',
          ru: 'Кураторская подборка красных, белых и розовых вин'
        },
        price: 12,
        tags: {
          en: [],
          tr: [],
          ru: []
        },
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop&q=80'
      },
      {
        name: {
          en: 'Artisan Tea',
          tr: 'El Yapımı Çay',
          ru: 'Артизанский чай'
        },
        description: {
          en: 'Selection of premium loose-leaf teas',
          tr: 'Premium yaprak çay seçkisi',
          ru: 'Подборка премиальных рассыпных чаев'
        },
        price: 5,
        tags: {
          en: ['Vegetarian', 'Vegan', 'Gluten Free'],
          tr: ['Vejetaryen', 'Vegan', 'Glutensiz'],
          ru: ['Вегетарианское', 'Веганское', 'Без глютена']
        },
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&q=80'
      }
    ]
  }
]

export async function seedMenuDataMultilingual(): Promise<void> {
  console.log('Starting to seed multilingual menu data...')
  
  try {
    // Check if data already exists
    const existingData = await getMenuData('en')
    if (existingData.length > 0) {
      const hasItems = existingData.some(cat => cat.items.length > 0)
      if (hasItems) {
        throw new Error('Menu data already exists. Please clear existing data first if you want to reseed.')
      }
    }
    
    // Add categories and items
    for (const category of sampleMenuDataMultilingual) {
      console.log(`Adding category: ${category.title.en}`)
      
      // Add category with translations
      await addCategory({
        id: category.id,
        title: category.title,
        icon: category.icon,
      })
      
      // Add items with translations and order
      for (let i = 0; i < category.items.length; i++) {
        const item = category.items[i]
        console.log(`  Adding item: ${item.name.en}`)
        
        await addMenuItem(category.id, {
          name: item.name,
          description: item.description,
          price: item.price,
          tags: item.tags,
          imageUrl: item.imageUrl,
          order: i,
        })
        
        // Small delay to avoid overwhelming Firebase
        await new Promise(resolve => setTimeout(resolve, 150))
      }
    }
    
    console.log('✅ Multilingual menu data seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding multilingual menu data:', error)
    throw error
  }
}
