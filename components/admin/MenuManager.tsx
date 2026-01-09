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
  type TranslatedMenuCategory,
} from '@/lib/menu-data'
import { Leaf, Sparkles, Coffee, UtensilsCrossed } from 'lucide-react'

const iconMap: Record<string, any> = {
  Leaf,
  Sparkles,
  Coffee,
  UtensilsCrossed,
}

export function MenuManager() {
  const [categories, setCategories] = useState<TranslatedMenuCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [editingItem, setEditingItem] = useState<{ categoryId: string; item: MenuItem } | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    tags: '',
  })

  useEffect(() => {
    loadMenuData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMenuData = async () => {
    const data = await getMenuData('en') // Load with English for admin
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

  const handleEdit = (categoryId: string, item: any) => {
    // In MenuManager, items from TranslatedMenuCategory are TranslatedMenuItem (name/description/tags are strings)
    // But we need to handle both types for backwards compatibility
    setEditingItem({ categoryId, item })
    
    const nameStr = typeof item.name === 'string' ? item.name : (item.name as any)?.en || item.name?.tr || item.name?.ru || ''
    const descStr = typeof item.description === 'string' ? item.description : (item.description as any)?.en || item.description?.tr || item.description?.ru || ''
    const tagsArray = Array.isArray(item.tags) ? item.tags : (item.tags as any)?.en || (item.tags as any)?.tr || (item.tags as any)?.ru || []
    const tagsStr = tagsArray.join(', ')
    
    setFormData({
      name: nameStr,
      description: descStr,
      price: item.price.toString(),
      tags: tagsStr,
    })
    setIsAdding(false)
  }

  const handleSave = async () => {
    if (!selectedCategory) {
      setError('Please select a category first')
      setTimeout(() => setError(null), 3000)
      return
    }

    // Validation
    if (!formData.name.trim()) {
      setError('Item name is required')
      setTimeout(() => setError(null), 3000)
      return
    }

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price')
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      if (editingItem) {
        await updateMenuItem(editingItem.categoryId, editingItem.item.id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          tags,
        })
        setSuccess('Item updated successfully!')
      } else {
        await addMenuItem(selectedCategory, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          tags,
        })
        setSuccess('Item added successfully!')
      }

      await loadMenuData()
      setEditingItem(null)
      setIsAdding(false)
      setFormData({ name: '', description: '', price: '', tags: '' })
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error saving item:', err)
      setError(err.message || 'Failed to save item. Please try again.')
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (categoryId: string, itemId: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setIsLoading(true)
      setError(null)
      setSuccess(null)
      
      try {
        await deleteMenuItem(categoryId, itemId)
        await loadMenuData()
        setSuccess('Item deleted successfully!')
        setTimeout(() => setSuccess(null), 3000)
      } catch (err: any) {
        console.error('Error deleting item:', err)
        setError(err.message || 'Failed to delete item. Please try again.')
        setTimeout(() => setError(null), 5000)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsAdding(false)
    setFormData({ name: '', description: '', price: '', tags: '' })
  }

  const currentCategory: TranslatedMenuCategory | undefined = categories.find(cat => cat.id === selectedCategory)
  const availableTags = ['Vegetarian', 'Gluten Free', 'Vegan', 'Spicy', 'Dairy Free']

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        >
          <p className="text-green-700 dark:text-green-300 font-medium">{success}</p>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
        </motion.div>
      )}

      {/* Category Selector */}
      <div className="glass-effect rounded-3xl p-6 soft-shadow">
        <label className="block text-sm font-medium text-foreground/70 mb-3">
          Select Category
        </label>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Leaf
            // category.title is always string in TranslatedMenuCategory
            const displayTitle = category.title
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  selectedCategory === category.id
                    ? 'bg-foreground text-background'
                    : 'bg-white/50 dark:bg-white/10 backdrop-blur-sm text-foreground/70 hover:text-foreground soft-shadow'
                }`}
              >
                <Icon className="w-4 h-4" />
                {displayTitle}
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
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors soft-shadow disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-colors"
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
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
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
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
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
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder="Vegetarian, Gluten Free"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isLoading || !formData.name.trim() || !formData.price}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors soft-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm text-foreground/70 hover:text-foreground font-medium transition-colors soft-shadow"
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
                            className="px-2 py-1 rounded-full text-xs font-medium bg-white/60 dark:bg-white/10 backdrop-blur-sm text-foreground/60 dark:text-foreground/50 border border-foreground/10 dark:border-foreground/20"
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
                      className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-foreground/70" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(selectedCategory, item.id)}
                      className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors"
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

