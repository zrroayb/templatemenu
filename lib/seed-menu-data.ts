// Seed function to populate Firebase with sample menu data
'use client'

import { addCategory, addMenuItem, getMenuData } from './menu-data'

export interface SeedCategory {
  id: string
  title: string
  icon: string
  items: Array<{
    name: string
    description: string
    price: number
    tags: string[]
    imageUrl?: string
  }>
}

export const sampleMenuData: SeedCategory[] = [
  {
    id: 'appetizers',
    title: 'Appetizers',
    icon: 'Leaf',
    items: [
      {
        name: 'Truffle Arancini',
        description: 'Crispy risotto balls with black truffle and parmesan, served with aioli',
        price: 18,
        tags: ['Vegetarian', 'Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Burrata & Prosciutto',
        description: 'Creamy burrata cheese with aged prosciutto, arugula, and balsamic glaze',
        price: 22,
        tags: [],
        imageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Crispy Artichoke Hearts',
        description: 'Golden fried artichoke hearts with lemon aioli and fresh herbs',
        price: 16,
        tags: ['Vegetarian'],
        imageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Tuna Tartare',
        description: 'Fresh yellowfin tuna with avocado, cucumber, and yuzu dressing',
        price: 24,
        tags: ['Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Wagyu Beef Carpaccio',
        description: 'Thinly sliced wagyu beef with arugula, parmesan, and truffle oil',
        price: 28,
        tags: ['Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'main-courses',
    title: 'Main Courses',
    icon: 'UtensilsCrossed',
    items: [
      {
        name: 'Pan-Seared Salmon',
        description: 'Atlantic salmon with roasted vegetables, quinoa, and lemon butter sauce',
        price: 32,
        tags: ['Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Wagyu Beef Tenderloin',
        description: 'Premium wagyu tenderloin with truffle mashed potatoes and red wine reduction',
        price: 68,
        tags: [],
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Herb-Crusted Lamb Chops',
        description: 'Rack of lamb with rosemary, garlic, roasted root vegetables, and mint jus',
        price: 42,
        tags: ['Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Wild Mushroom Risotto',
        description: 'Creamy arborio rice with mixed wild mushrooms, truffle oil, and parmesan',
        price: 26,
        tags: ['Vegetarian', 'Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Grilled Sea Bass',
        description: 'Mediterranean sea bass with fennel, olives, cherry tomatoes, and white wine sauce',
        price: 34,
        tags: ['Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Duck Confit',
        description: 'Slow-cooked duck leg with cherry sauce, roasted potatoes, and seasonal greens',
        price: 38,
        tags: [],
        imageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=400&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'desserts',
    title: 'Desserts',
    icon: 'Sparkles',
    items: [
      {
        name: 'Chocolate Soufflé',
        description: 'Warm dark chocolate soufflé with vanilla ice cream and fresh berries',
        price: 16,
        tags: ['Vegetarian'],
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian tiramisu with espresso-soaked ladyfingers and mascarpone',
        price: 14,
        tags: ['Vegetarian'],
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Lemon Tart',
        description: 'Tangy lemon curd tart with meringue and candied lemon zest',
        price: 13,
        tags: ['Vegetarian', 'Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Crème Brûlée',
        description: 'Vanilla bean crème brûlée with caramelized sugar and fresh fruit',
        price: 12,
        tags: ['Vegetarian', 'Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Berry Pavlova',
        description: 'Crispy meringue with fresh seasonal berries, whipped cream, and mint',
        price: 15,
        tags: ['Vegetarian', 'Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'beverages',
    title: 'Beverages',
    icon: 'Coffee',
    items: [
      {
        name: 'Espresso',
        description: 'Rich and bold single shot espresso',
        price: 4,
        tags: ['Vegetarian', 'Vegan', 'Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and velvety foam',
        price: 5,
        tags: ['Vegetarian', 'Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice, served chilled',
        price: 6,
        tags: ['Vegetarian', 'Vegan', 'Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Craft Cocktail Selection',
        description: 'Ask your server for our seasonal craft cocktail menu',
        price: 14,
        tags: [],
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Wine Selection',
        description: 'Curated selection of red, white, and rosé wines',
        price: 12,
        tags: [],
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop&q=80'
      },
      {
        name: 'Artisan Tea',
        description: 'Selection of premium loose-leaf teas',
        price: 5,
        tags: ['Vegetarian', 'Vegan', 'Gluten Free'],
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&q=80'
      }
    ]
  }
]

export async function seedMenuData(): Promise<void> {
  console.log('Starting to seed menu data...')
  
  try {
    // Check if data already exists
    const existingData = await getMenuData()
    if (existingData.length > 0) {
      const hasItems = existingData.some(cat => cat.items.length > 0)
      if (hasItems) {
        throw new Error('Menu data already exists. Please clear existing data first if you want to reseed.')
      }
    }
    
    // Add categories and items
    for (const category of sampleMenuData) {
      console.log(`Adding category: ${category.title}`)
      
      // Check if category exists
      const categoryExists = existingData.some(cat => cat.id === category.id)
      if (!categoryExists) {
        // Add category
        await addCategory({
          id: category.id,
          title: category.title,
          icon: category.icon,
        })
      }
      
      // Add items with order
      for (let i = 0; i < category.items.length; i++) {
        const item = category.items[i]
        console.log(`  Adding item: ${item.name}`)
        
        await addMenuItem(category.id, {
          ...item,
          order: i,
        })
        
        // Small delay to avoid overwhelming Firebase
        await new Promise(resolve => setTimeout(resolve, 150))
      }
    }
    
    console.log('✅ Menu data seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding menu data:', error)
    throw error
  }
}
