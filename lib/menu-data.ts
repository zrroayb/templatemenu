// Centralized menu data store
// In a real app, this would connect to a database/API

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  tags: string[]
}

export interface MenuCategory {
  id: string
  title: string
  icon: string
  items: MenuItem[]
}

let menuData: MenuCategory[] = [
  {
    id: 'appetizers',
    title: 'Appetizers',
    icon: 'Leaf',
    items: [
      {
        id: 1,
        name: 'Truffle Arancini',
        description: 'Crispy risotto balls with black truffle and parmesan, served with aioli',
        price: 18,
        tags: ['Vegetarian', 'Gluten Free'],
      },
      {
        id: 2,
        name: 'Burrata & Prosciutto',
        description: 'Creamy burrata with aged prosciutto, arugula, and balsamic reduction',
        price: 22,
        tags: [],
      },
      {
        id: 3,
        name: 'Crispy Artichoke Hearts',
        description: 'Golden fried artichokes with lemon aioli and fresh herbs',
        price: 16,
        tags: ['Vegetarian'],
      },
    ],
  },
  {
    id: 'mains',
    title: 'Main Courses',
    icon: 'UtensilsCrossed',
    items: [
      {
        id: 4,
        name: 'Pan-Seared Salmon',
        description: 'Atlantic salmon with roasted vegetables, quinoa, and herb butter',
        price: 32,
        tags: ['Gluten Free'],
      },
      {
        id: 5,
        name: 'Wagyu Beef Tenderloin',
        description: '8oz premium wagyu with truffle mashed potatoes and seasonal vegetables',
        price: 68,
        tags: [],
      },
      {
        id: 6,
        name: 'Wild Mushroom Risotto',
        description: 'Creamy arborio rice with wild mushrooms, parmesan, and white wine',
        price: 26,
        tags: ['Vegetarian'],
      },
      {
        id: 7,
        name: 'Herb-Crusted Lamb Chops',
        description: 'Three lamb chops with mint pesto, roasted root vegetables, and jus',
        price: 42,
        tags: [],
      },
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts',
    icon: 'Sparkles',
    items: [
      {
        id: 8,
        name: 'Chocolate Soufflé',
        description: 'Warm dark chocolate soufflé with vanilla ice cream',
        price: 16,
        tags: ['Vegetarian'],
      },
      {
        id: 9,
        name: 'Lemon Tart',
        description: 'Zesty lemon curd in a buttery shortcrust, with fresh berries',
        price: 14,
        tags: ['Vegetarian'],
      },
      {
        id: 10,
        name: 'Tiramisu',
        description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
        price: 15,
        tags: ['Vegetarian'],
      },
    ],
  },
  {
    id: 'beverages',
    title: 'Beverages',
    icon: 'Coffee',
    items: [
      {
        id: 11,
        name: 'Signature Cocktails',
        description: 'Curated selection of handcrafted cocktails',
        price: 14,
        tags: [],
      },
      {
        id: 12,
        name: 'Wine Selection',
        description: 'Premium wines from renowned vineyards',
        price: 12,
        tags: [],
      },
      {
        id: 13,
        name: 'Artisan Coffee',
        description: 'Single-origin coffee, espresso, and specialty drinks',
        price: 8,
        tags: ['Vegetarian'],
      },
    ],
  },
]

export function getMenuData(): MenuCategory[] {
  return menuData
}

export function setMenuData(data: MenuCategory[]): void {
  menuData = data
  // In a real app, this would save to a database
  if (typeof window !== 'undefined') {
    localStorage.setItem('menuData', JSON.stringify(data))
  }
}

export function addMenuItem(categoryId: string, item: Omit<MenuItem, 'id'>): void {
  const category = menuData.find(cat => cat.id === categoryId)
  if (category) {
    const newId = Math.max(...menuData.flatMap(cat => cat.items.map(i => i.id)), 0) + 1
    category.items.push({ ...item, id: newId })
    setMenuData([...menuData])
  }
}

export function updateMenuItem(categoryId: string, itemId: number, updates: Partial<MenuItem>): void {
  const category = menuData.find(cat => cat.id === categoryId)
  if (category) {
    const itemIndex = category.items.findIndex(item => item.id === itemId)
    if (itemIndex !== -1) {
      category.items[itemIndex] = { ...category.items[itemIndex], ...updates }
      setMenuData([...menuData])
    }
  }
}

export function deleteMenuItem(categoryId: string, itemId: number): void {
  const category = menuData.find(cat => cat.id === categoryId)
  if (category) {
    category.items = category.items.filter(item => item.id !== itemId)
    setMenuData([...menuData])
  }
}

// Load from localStorage on init
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('menuData')
  if (saved) {
    try {
      menuData = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load menu data from localStorage', e)
    }
  }
}

