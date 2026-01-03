'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react'
import {
  getMenuData,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItem,
  type MenuCategory,
} from '@/lib/menu-data'
import { Leaf, Sparkles, Coffee, UtensilsCrossed } from 'lucide-react'

const iconMap: Record<string, any> = {
  Leaf,
  Sparkles,
  Coffee,
  UtensilsCrossed,
}

export function MenuManager() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [editingItem, setEditingItem] = useState<{ categoryId: string; item: MenuItem } | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    tags: '',
  })

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = () => {
    const data = getMenuData()
    setCategories(data)
    if (data.length > 0 && (!selectedCategory || !data.find(cat => cat.id === selectedCategory))) {
      setSelectedCategory(data[0].id)
    }
  }

  const handleAdd = () => {
    if (!selectedCategory) return
    setIsAdding(true)
    setFormData({ name: '', description: '', price: '', tags: '' })
  }

  const handleEdit = (categoryId: string, item: MenuItem) => {
    setEditingItem({ categoryId, item })
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      tags: item.tags.join(', '),
    })
    setIsAdding(false)
  }

  const handleSave = () => {
    if (!selectedCategory) return

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    if (editingItem) {
      updateMenuItem(editingItem.categoryId, editingItem.item.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        tags,
      })
    } else {
      addMenuItem(selectedCategory, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        tags,
      })
    }

    loadMenuData()
    setEditingItem(null)
    setIsAdding(false)
    setFormData({ name: '', description: '', price: '', tags: '' })
  }

  const handleDelete = (categoryId: string, itemId: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(categoryId, itemId)
      loadMenuData()
    }
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsAdding(false)
    setFormData({ name: '', description: '', price: '', tags: '' })
  }

  const currentCategory = categories.find(cat => cat.id === selectedCategory)
  const availableTags = ['Vegetarian', 'Gluten Free', 'Vegan', 'Spicy', 'Dairy Free']

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div className="glass-effect rounded-3xl p-6 soft-shadow">
        <label className="block text-sm font-medium text-foreground/70 mb-3">
          Select Category
        </label>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Leaf
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  selectedCategory === category.id
                    ? 'bg-foreground text-background'
                    : 'bg-white/50 backdrop-blur-sm text-foreground/70 hover:text-foreground soft-shadow'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.title}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Add Button */}
      {selectedCategory && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors soft-shadow"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </motion.button>
      )}

      {/* Form */}
      <AnimatePresence>
        {(isAdding || editingItem) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-effect rounded-3xl p-8 soft-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button
                onClick={handleCancel}
                className="p-2 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  placeholder="Item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                  placeholder="Item description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder="Vegetarian, Gluten Free"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors soft-shadow"
                >
                  <Save className="w-4 h-4" />
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-xl bg-white/50 backdrop-blur-sm text-foreground/70 hover:text-foreground font-medium transition-colors soft-shadow"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items List */}
      {currentCategory && (
        <div className="space-y-4">
          {currentCategory.items.length === 0 ? (
            <div className="glass-effect rounded-3xl p-12 text-center soft-shadow">
              <p className="text-foreground/50">No items in this category yet.</p>
            </div>
          ) : (
            currentCategory.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-effect rounded-2xl p-6 soft-shadow hover:soft-shadow-hover transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-serif text-xl font-semibold text-foreground">
                        {item.name}
                      </h4>
                      <span className="font-serif text-lg font-bold text-foreground">
                        ${item.price}
                      </span>
                    </div>
                    <p className="text-foreground/60 text-sm mb-3">{item.description}</p>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-white/60 backdrop-blur-sm text-foreground/60 border border-foreground/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(selectedCategory, item)}
                      className="p-2 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-foreground/70" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(selectedCategory, item.id)}
                      className="p-2 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

