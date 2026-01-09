'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react'
import { getMenuData, addCategory, updateCategory, deleteCategory, type MenuCategory } from '@/lib/menu-data'
import { Leaf, Sparkles, Coffee, UtensilsCrossed, type LucideIcon } from 'lucide-react'

const availableIcons: { name: string; icon: LucideIcon }[] = [
  { name: 'Leaf', icon: Leaf },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Coffee', icon: Coffee },
  { name: 'UtensilsCrossed', icon: UtensilsCrossed },
]

export function CategoryManager() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    icon: 'Leaf',
  })

  useEffect(() => {
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadCategories = async () => {
    const data = await getMenuData()
    setCategories(data)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({ id: '', title: '', icon: 'Leaf' })
  }

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category)
    setFormData({
      id: category.id,
      title: category.title,
      icon: category.icon,
    })
    setIsAdding(false)
  }

  const handleSave = async () => {
    // Validation
    if (!formData.title.trim()) {
      setError('Category name is required')
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
    if (editingCategory) {
        await updateCategory(editingCategory.id, {
          title: formData.title.trim(),
          icon: formData.icon,
        })
        setSuccess('Category updated successfully!')
      } else {
        const newId = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        if (!newId) {
          setError('Invalid category name. Please use letters, numbers, and spaces only.')
          setIsLoading(false)
          setTimeout(() => setError(null), 3000)
          return
        }
        
        await addCategory({
        id: newId,
          title: formData.title.trim(),
        icon: formData.icon,
      })
        setSuccess('Category added successfully!')
    }

      await loadCategories()
    setEditingCategory(null)
    setIsAdding(false)
    setFormData({ id: '', title: '', icon: 'Leaf' })
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error saving category:', err)
      setError(err.message || 'Failed to save category. Please try again.')
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
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

  const handleCancel = () => {
    setEditingCategory(null)
    setIsAdding(false)
    setFormData({ id: '', title: '', icon: 'Leaf' })
  }

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

      {/* Add Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAdd}
        disabled={isLoading || isAdding}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors soft-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-5 h-5" />
        Add New Category
      </motion.button>

      {/* Form */}
      <AnimatePresence>
        {(isAdding || editingCategory) && (
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
                onClick={handleCancel}
                className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  placeholder="Category name"
                />
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
                      onClick={() => setFormData({ ...formData, icon: name })}
                      className={`p-4 rounded-xl transition-all ${
                        formData.icon === name
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
                  onClick={handleSave}
                  disabled={isLoading || !formData.title.trim()}
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

      {/* Categories List */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="glass-effect rounded-3xl p-12 text-center soft-shadow">
            <p className="text-foreground/50">No categories yet.</p>
          </div>
        ) : (
          categories.map((category, index) => {
            const IconComponent = availableIcons.find(i => i.name === category.icon)?.icon || Leaf
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-effect rounded-2xl p-6 soft-shadow hover:soft-shadow-hover transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm soft-shadow">
                      <IconComponent className="w-6 h-6 text-foreground/70" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl font-semibold text-foreground mb-1">
                        {category.title}
                      </h4>
                      <p className="text-sm text-foreground/50">
                        {category.items.length} item{category.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(category)}
                      className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/20 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-foreground/70" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(category.id)}
                      className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

