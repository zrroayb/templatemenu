'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, ChevronDown, ChevronUp, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
import { 
  getMenuData,
  getRawMenuData, 
  addCategory, 
  updateCategory, 
  deleteCategory, 
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderItems,
  type MenuCategory,
  type MenuItem
} from '@/lib/menu-data'
import { Leaf, Sparkles, Coffee, UtensilsCrossed, type LucideIcon } from 'lucide-react'

const availableIcons: { name: string; icon: LucideIcon }[] = [
  { name: 'Leaf', icon: Leaf },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Coffee', icon: Coffee },
  { name: 'UtensilsCrossed', icon: UtensilsCrossed },
]

export function CategoryManager() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [editingItem, setEditingItem] = useState<{ categoryId: string; item: MenuItem } | null>(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddingItem, setIsAddingItem] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<{ categoryId: string; itemId: number } | null>(null)
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    title: { en: '', tr: '', ru: '' },
    icon: 'Leaf',
  })
  const [itemFormData, setItemFormData] = useState({
    name: { en: '', tr: '', ru: '' },
    description: { en: '', tr: '', ru: '' },
    price: '',
    tags: { en: [] as string[], tr: [] as string[], ru: [] as string[] },
    imageUrl: '',
  })

  useEffect(() => {
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadCategories = async () => {
    // Load raw data (untranslated) for admin panel so we can edit all languages
    const data = await getRawMenuData()
    setCategories(data)
  }

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  // Category Management
  const handleAddCategory = () => {
    setIsAddingCategory(true)
    setCategoryFormData({ id: '', title: { en: '', tr: '', ru: '' }, icon: 'Leaf' })
  }

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category)
    // Parse title - can be string or Translations object
    const titleObj = typeof category.title === 'string'
      ? { en: category.title, tr: category.title, ru: category.title }
      : category.title as { en: string; tr: string; ru: string }
    
    setCategoryFormData({
      id: category.id,
      title: titleObj,
      icon: category.icon,
    })
    setIsAddingCategory(false)
  }

  const handleSaveCategory = async () => {
    if (!categoryFormData.title.en.trim() && !categoryFormData.title.tr.trim() && !categoryFormData.title.ru.trim()) {
      setError('Category name is required in at least one language')
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const titleData = {
        en: categoryFormData.title.en.trim() || categoryFormData.title.en,
        tr: categoryFormData.title.tr.trim() || categoryFormData.title.tr,
        ru: categoryFormData.title.ru.trim() || categoryFormData.title.ru,
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          title: titleData,
          icon: categoryFormData.icon,
        })
        setSuccess('Category updated successfully!')
      } else {
        // Use English title for ID, fallback to Turkish or Russian
        const titleForId = categoryFormData.title.en.trim() || categoryFormData.title.tr.trim() || categoryFormData.title.ru.trim()
        const newId = titleForId.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        if (!newId) {
          setError('Invalid category name. Please use letters, numbers, and spaces only.')
          setIsLoading(false)
          setTimeout(() => setError(null), 3000)
          return
        }
        
        await addCategory({
          id: newId,
          title: titleData,
          icon: categoryFormData.icon,
        })
        setSuccess('Category added successfully!')
      }

      await loadCategories()
      setEditingCategory(null)
      setIsAddingCategory(false)
      setCategoryFormData({ id: '', title: { en: '', tr: '', ru: '' }, icon: 'Leaf' })
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error saving category:', err)
      setError(err.message || 'Failed to save category. Please try again.')
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? All items in it will be deleted.')) {
      setIsLoading(true)
      setError(null)
      setSuccess(null)
      
      try {
        await deleteCategory(categoryId)
        await loadCategories()
        setSuccess('Category deleted successfully!')
        setTimeout(() => setSuccess(null), 3000)
      } catch (err: any) {
        console.error('Error deleting category:', err)
        setError(err.message || 'Failed to delete category. Please try again.')
        setTimeout(() => setError(null), 5000)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCancelCategory = () => {
    setEditingCategory(null)
    setIsAddingCategory(false)
    setCategoryFormData({ id: '', title: { en: '', tr: '', ru: '' }, icon: 'Leaf' })
  }

  // Item Management
  const handleAddItem = (categoryId: string) => {
    setIsAddingItem(categoryId)
    setItemFormData({ 
      name: { en: '', tr: '', ru: '' }, 
      description: { en: '', tr: '', ru: '' }, 
      price: '', 
      tags: { en: [], tr: [], ru: [] },
      imageUrl: '',
    })
    // Expand category if not already expanded
    if (!expandedCategories.has(categoryId)) {
      setExpandedCategories(new Set([...expandedCategories, categoryId]))
    }
  }

  const handleEditItem = (categoryId: string, item: MenuItem) => {
    setEditingItem({ categoryId, item })
    
    // Parse name and description - can be string or Translations object
    const nameObj = typeof item.name === 'string'
      ? { en: item.name, tr: item.name, ru: item.name }
      : item.name as { en: string; tr: string; ru: string }
    
    const descObj = typeof item.description === 'string'
      ? { en: item.description, tr: item.description, ru: item.description }
      : item.description as { en: string; tr: string; ru: string }
    
    // Parse tags - can be array or object with language keys
    const tagsObj = Array.isArray(item.tags)
      ? { en: item.tags, tr: item.tags, ru: item.tags }
      : item.tags as { en: string[]; tr: string[]; ru: string[] }
    
    setItemFormData({
      name: nameObj,
      description: descObj,
      price: item.price.toString(),
      tags: tagsObj,
      imageUrl: item.imageUrl || '',
    })
    setIsAddingItem(null)
  }

  const handleSaveItem = async () => {
    const categoryId = isAddingItem || editingItem?.categoryId
    if (!categoryId) {
      setError('Category is required')
      setTimeout(() => setError(null), 3000)
      return
    }

    if (!itemFormData.name.en.trim() && !itemFormData.name.tr.trim() && !itemFormData.name.ru.trim()) {
      setError('Item name is required in at least one language')
      setTimeout(() => setError(null), 3000)
      return
    }

    if (!itemFormData.price || isNaN(parseFloat(itemFormData.price)) || parseFloat(itemFormData.price) <= 0) {
      setError('Please enter a valid price')
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const nameData = {
        en: itemFormData.name.en.trim() || itemFormData.name.en,
        tr: itemFormData.name.tr.trim() || itemFormData.name.tr,
        ru: itemFormData.name.ru.trim() || itemFormData.name.ru,
      }
      
      const descriptionData = {
        en: itemFormData.description.en.trim() || itemFormData.description.en,
        tr: itemFormData.description.tr.trim() || itemFormData.description.tr,
        ru: itemFormData.description.ru.trim() || itemFormData.description.ru,
      }
      
      const tagsData = {
        en: itemFormData.tags.en || [],
        tr: itemFormData.tags.tr || [],
        ru: itemFormData.tags.ru || [],
      }

      if (editingItem) {
        await updateMenuItem(editingItem.categoryId, editingItem.item.id, {
          name: nameData,
          description: descriptionData,
          price: parseFloat(itemFormData.price),
          tags: tagsData,
          imageUrl: itemFormData.imageUrl || undefined,
        })
        setSuccess('Item updated successfully!')
      } else {
        const category = categories.find(c => c.id === categoryId)
        // Calculate max order: find highest order value or use items length
        const maxOrder = category?.items.length 
          ? Math.max(...category.items.map(item => item.order ?? -1)) + 1
          : 0
        await addMenuItem(categoryId, {
          name: nameData,
          description: descriptionData,
          price: parseFloat(itemFormData.price),
          tags: tagsData,
          imageUrl: itemFormData.imageUrl || undefined,
          order: maxOrder,
        })
        setSuccess('Item added successfully!')
      }

      await loadCategories()
      setEditingItem(null)
      setIsAddingItem(null)
      setItemFormData({ 
        name: { en: '', tr: '', ru: '' }, 
        description: { en: '', tr: '', ru: '' }, 
        price: '', 
        tags: { en: [], tr: [], ru: [] },
        imageUrl: '',
      })
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error saving item:', err)
      setError(err.message || 'Failed to save item. Please try again.')
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItem = async (categoryId: string, itemId: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setIsLoading(true)
      setError(null)
      setSuccess(null)
      
      try {
        await deleteMenuItem(categoryId, itemId)
        await loadCategories()
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

  const handleCancelItem = () => {
    setEditingItem(null)
    setIsAddingItem(null)
    setItemFormData({ 
      name: { en: '', tr: '', ru: '' }, 
      description: { en: '', tr: '', ru: '' }, 
      price: '', 
      tags: { en: [], tr: [], ru: [] },
      imageUrl: '',
    })
  }

  // Drag & Drop for reordering
  const handleDragStart = (categoryId: string, itemId: number) => {
    setDraggedItem({ categoryId, itemId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (categoryId: string, targetItemId: number) => {
    if (!draggedItem || draggedItem.categoryId !== categoryId) return

    const category = categories.find(c => c.id === categoryId)
    if (!category) return

    const items = [...category.items]
    const draggedIndex = items.findIndex(item => item.id === draggedItem.itemId)
    const targetIndex = items.findIndex(item => item.id === targetItemId)

    if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
      setDraggedItem(null)
      return
    }

    // Reorder items
    const [removed] = items.splice(draggedIndex, 1)
    items.splice(targetIndex, 0, removed)

    // Update orders
    const itemIds = items.map(item => item.id)
    setIsLoading(true)
    try {
      await reorderItems(categoryId, itemIds)
      await loadCategories()
      setSuccess('Items reordered successfully!')
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      console.error('Error reordering items:', err)
      setError('Failed to reorder items. Please try again.')
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
      setDraggedItem(null)
    }
  }

  // Move item up/down
  const handleMoveItem = async (categoryId: string, itemId: number, direction: 'up' | 'down') => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return

    const items = [...category.items]
    const currentIndex = items.findIndex(item => item.id === itemId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= items.length) return

    // Swap items
    [items[currentIndex], items[newIndex]] = [items[newIndex], items[currentIndex]]

    const itemIds = items.map(item => item.id)
    setIsLoading(true)
    try {
      await reorderItems(categoryId, itemIds)
      await loadCategories()
      setSuccess('Item moved successfully!')
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      console.error('Error moving item:', err)
      setError('Failed to move item. Please try again.')
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
          Products & Categories
        </h2>
        <p className="text-foreground/60 font-light">
          Manage your menu categories and products. Click on a category to expand and manage its products.
        </p>
      </div>

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

      {/* Add Category Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddCategory}
        disabled={isLoading || isAddingCategory}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors soft-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-5 h-5" />
        Add New Category
      </motion.button>

      {/* Category Form */}
      <AnimatePresence>
        {(isAddingCategory || editingCategory) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-effect rounded-3xl p-8 soft-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={handleCancelCategory}
                className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-3">
                  Category Name (All Languages)
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground/60 mb-1.5">
                      English 🇬🇧
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.title.en}
                      onChange={(e) => setCategoryFormData({ 
                        ...categoryFormData, 
                        title: { ...categoryFormData.title, en: e.target.value } 
                      })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      placeholder="Category name (English)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground/60 mb-1.5">
                      Turkish 🇹🇷
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.title.tr}
                      onChange={(e) => setCategoryFormData({ 
                        ...categoryFormData, 
                        title: { ...categoryFormData.title, tr: e.target.value } 
                      })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      placeholder="Kategori adı (Türkçe)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground/60 mb-1.5">
                      Russian 🇷🇺
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.title.ru}
                      onChange={(e) => setCategoryFormData({ 
                        ...categoryFormData, 
                        title: { ...categoryFormData.title, ru: e.target.value } 
                      })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      placeholder="Название категории (Русский)"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {availableIcons.map(({ name, icon: Icon }) => (
                    <motion.button
                      key={name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCategoryFormData({ ...categoryFormData, icon: name })}
                      className={`p-4 rounded-xl transition-all ${
                        categoryFormData.icon === name
                          ? 'bg-foreground text-background soft-shadow'
                          : 'bg-white/50 dark:bg-white/10 backdrop-blur-sm text-foreground/70 hover:text-foreground soft-shadow'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto" />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveCategory}
                  disabled={isLoading || (!categoryFormData.title.en.trim() && !categoryFormData.title.tr.trim() && !categoryFormData.title.ru.trim())}
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
                  onClick={handleCancelCategory}
                  className="px-6 py-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm text-foreground/70 hover:text-foreground font-medium transition-colors soft-shadow"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="glass-effect rounded-3xl p-12 text-center soft-shadow">
            <p className="text-foreground/50">No categories yet.</p>
          </div>
        ) : (
          categories.map((category, index) => {
            const IconComponent = availableIcons.find(i => i.name === category.icon)?.icon || Leaf
            const isExpanded = expandedCategories.has(category.id)
            const isAddingItemToThis = isAddingItem === category.id
            const isEditingItemInThis = editingItem?.categoryId === category.id
            
            // Get display title - can be string or Translations object
            const displayTitle = typeof category.title === 'string' 
              ? category.title 
              : category.title.en || category.title.tr || category.title.ru || category.id

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-effect rounded-2xl overflow-hidden soft-shadow hover:soft-shadow-hover transition-all"
              >
                {/* Category Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center gap-4 flex-1 text-left"
                    >
                      <div className="p-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm soft-shadow">
                        <IconComponent className="w-6 h-6 text-foreground/70" />
                      </div>
                      <div className="flex-1">
                      <h4 className="font-serif text-xl font-semibold text-foreground mb-1">
                        {displayTitle}
                      </h4>
                        <p className="text-sm text-foreground/50">
                          {category.items.length} item{category.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-foreground/50" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-foreground/50" />
                      )}
                    </motion.button>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditCategory(category)}
                        className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-foreground/70" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-4 border-t border-foreground/10 dark:border-foreground/20 pt-6">
                        {/* Add Item Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddItem(category.id)}
                          disabled={isLoading || isAddingItemToThis || isEditingItemInThis}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground/10 dark:bg-foreground/20 text-foreground font-medium hover:bg-foreground/20 dark:hover:bg-foreground/30 transition-colors soft-shadow disabled:opacity-50 disabled:cursor-not-allowed w-full"
                        >
                          <Plus className="w-4 h-4" />
                          Add Item to {displayTitle}
                        </motion.button>

                        {/* Item Form */}
                        {(isAddingItemToThis || isEditingItemInThis) && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass-effect rounded-2xl p-6 soft-shadow"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-serif text-lg font-semibold text-foreground">
                                {editingItem ? 'Edit Item' : 'Add New Item'}
                              </h5>
                              <button
                                onClick={handleCancelItem}
                                className="p-1.5 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-colors"
                              >
                                <X className="w-4 h-4 text-foreground/70" />
                              </button>
                            </div>

                            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                              {/* Name - Multilingual */}
                              <div>
                                <label className="block text-xs font-medium text-foreground/70 mb-2">
                                  Name (All Languages) *
                                </label>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs text-foreground/60 mb-1">English 🇬🇧</label>
                                    <input
                                      type="text"
                                      value={itemFormData.name.en}
                                      onChange={(e) => setItemFormData({ ...itemFormData, name: { ...itemFormData.name, en: e.target.value } })}
                                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
                                      placeholder="Item name (English)"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-foreground/60 mb-1">Turkish 🇹🇷</label>
                                    <input
                                      type="text"
                                      value={itemFormData.name.tr}
                                      onChange={(e) => setItemFormData({ ...itemFormData, name: { ...itemFormData.name, tr: e.target.value } })}
                                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
                                      placeholder="Ürün adı (Türkçe)"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-foreground/60 mb-1">Russian 🇷🇺</label>
                                    <input
                                      type="text"
                                      value={itemFormData.name.ru}
                                      onChange={(e) => setItemFormData({ ...itemFormData, name: { ...itemFormData.name, ru: e.target.value } })}
                                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
                                      placeholder="Название продукта (Русский)"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Description - Multilingual */}
                              <div>
                                <label className="block text-xs font-medium text-foreground/70 mb-2">
                                  Description (All Languages)
                                </label>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs text-foreground/60 mb-1">English 🇬🇧</label>
                                    <textarea
                                      rows={2}
                                      value={itemFormData.description.en}
                                      onChange={(e) => setItemFormData({ ...itemFormData, description: { ...itemFormData.description, en: e.target.value } })}
                                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none text-sm"
                                      placeholder="Item description (English)"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-foreground/60 mb-1">Turkish 🇹🇷</label>
                                    <textarea
                                      rows={2}
                                      value={itemFormData.description.tr}
                                      onChange={(e) => setItemFormData({ ...itemFormData, description: { ...itemFormData.description, tr: e.target.value } })}
                                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none text-sm"
                                      placeholder="Ürün açıklaması (Türkçe)"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-foreground/60 mb-1">Russian 🇷🇺</label>
                                    <textarea
                                      rows={2}
                                      value={itemFormData.description.ru}
                                      onChange={(e) => setItemFormData({ ...itemFormData, description: { ...itemFormData.description, ru: e.target.value } })}
                                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none text-sm"
                                      placeholder="Описание продукта (Русский)"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Price and Image URL */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-foreground/70 mb-1.5">
                                    Price ($) *
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={itemFormData.price}
                                    onChange={(e) => setItemFormData({ ...itemFormData, price: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
                                    placeholder="0.00"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-foreground/70 mb-1.5">
                                    Image URL
                                  </label>
                                  <input
                                    type="url"
                                    value={itemFormData.imageUrl}
                                    onChange={(e) => setItemFormData({ ...itemFormData, imageUrl: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
                                    placeholder="https://..."
                                  />
                                </div>
                              </div>

                              {/* Tags - Multilingual */}
                              <div>
                                <label className="block text-xs font-medium text-foreground/70 mb-2">
                                  Tags (Comma-separated, All Languages)
                                </label>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs text-foreground/60 mb-1">English 🇬🇧</label>
                                    <input
                                      type="text"
                                      value={Array.isArray(itemFormData.tags.en) ? itemFormData.tags.en.join(', ') : ''}
                                      onChange={(e) => {
                                        const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0)
                                        setItemFormData({ ...itemFormData, tags: { ...itemFormData.tags, en: tags } })
                                      }}
                                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
                                      placeholder="Vegetarian, Gluten Free"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-foreground/60 mb-1">Turkish 🇹🇷</label>
                                    <input
                                      type="text"
                                      value={Array.isArray(itemFormData.tags.tr) ? itemFormData.tags.tr.join(', ') : ''}
                                      onChange={(e) => {
                                        const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0)
                                        setItemFormData({ ...itemFormData, tags: { ...itemFormData.tags, tr: tags } })
                                      }}
                                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
                                      placeholder="Vejetaryen, Glutensiz"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-foreground/60 mb-1">Russian 🇷🇺</label>
                                    <input
                                      type="text"
                                      value={Array.isArray(itemFormData.tags.ru) ? itemFormData.tags.ru.join(', ') : ''}
                                      onChange={(e) => {
                                        const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0)
                                        setItemFormData({ ...itemFormData, tags: { ...itemFormData.tags, ru: tags } })
                                      }}
                                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
                                      placeholder="Вегетарианское, Без глютена"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-2">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={handleSaveItem}
                                  disabled={isLoading || (!itemFormData.name.en.trim() && !itemFormData.name.tr.trim() && !itemFormData.name.ru.trim()) || !itemFormData.price}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors soft-shadow disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                  {isLoading ? (
                                    <>
                                      <div className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                      Saving...
                                    </>
                                  ) : (
                                    <>
                                      <Save className="w-3 h-3" />
                                      Save
                                    </>
                                  )}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={handleCancelItem}
                                  className="px-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm text-foreground/70 hover:text-foreground font-medium transition-colors soft-shadow text-sm"
                                >
                                  Cancel
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Items List */}
                        {category.items.length === 0 ? (
                          <div className="glass-effect rounded-xl p-8 text-center soft-shadow">
                            <p className="text-foreground/50 text-sm">No items in this category yet.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {category.items.map((item, itemIndex) => {
                              // Get display values - can be string or Translations object
                              const displayName = typeof item.name === 'string' 
                                ? item.name 
                                : item.name.en || item.name.tr || item.name.ru || ''
                              
                              const displayDescription = typeof item.description === 'string'
                                ? item.description
                                : item.description.en || item.description.tr || item.description.ru || ''
                              
                              const displayTags = Array.isArray(item.tags)
                                ? item.tags
                                : item.tags.en || item.tags.tr || item.tags.ru || []
                              
                              return (
                              <motion.div
                                key={item.id}
                                draggable
                                onDragStart={() => handleDragStart(category.id, item.id)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => {
                                  e.preventDefault()
                                  handleDrop(category.id, item.id)
                                }}
                                className={`glass-effect rounded-xl p-4 soft-shadow hover:soft-shadow-hover transition-all ${
                                  draggedItem?.itemId === item.id ? 'opacity-50' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  {/* Drag Handle */}
                                  <div className="flex flex-col gap-1 pt-1">
                                    <GripVertical className="w-4 h-4 text-foreground/30 cursor-move" />
                                    <div className="flex flex-col gap-0.5">
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleMoveItem(category.id, item.id, 'up')}
                                        disabled={itemIndex === 0}
                                        className="p-0.5 rounded hover:bg-white/50 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        <ArrowUp className="w-3 h-3 text-foreground/50" />
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleMoveItem(category.id, item.id, 'down')}
                                        disabled={itemIndex === category.items.length - 1}
                                        className="p-0.5 rounded hover:bg-white/50 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        <ArrowDown className="w-3 h-3 text-foreground/50" />
                                      </motion.button>
                                    </div>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                      <h5 className="font-serif text-base font-semibold text-foreground">
                                        {displayName}
                                      </h5>
                                      <span className="font-serif text-base font-bold text-foreground ml-2">
                                        ${item.price.toFixed(2)}
                                      </span>
                                    </div>
                                    {displayDescription && (
                                      <p className="text-foreground/60 text-xs mb-2 line-clamp-2">
                                        {displayDescription}
                                      </p>
                                    )}
                                    {displayTags.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5">
                                        {displayTags.map((tag, tagIndex) => (
                                          <span
                                            key={tagIndex}
                                            className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-white/60 dark:bg-white/10 backdrop-blur-sm text-foreground/60 dark:text-foreground/50 border border-foreground/10 dark:border-foreground/20"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex gap-1">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleEditItem(category.id, item)}
                                      className="p-1.5 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-colors"
                                    >
                                      <Edit2 className="w-3.5 h-3.5 text-foreground/70" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleDeleteItem(category.id, item.id)}
                                      className="p-1.5 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
