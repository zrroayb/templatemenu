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
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
    setError(null)
    setFormData({ id: '', title: '', icon: 'Leaf' })
  }

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category)
    setError(null)
    setFormData({
      id: category.id,
      title: category.title,
      icon: category.icon,
    })
    setIsAdding(false)
  }

  const handleSave = async () => {
    const trimmedTitle = formData.title.trim()
    if (!trimmedTitle) {
      setError('Category name is required.')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          title: trimmedTitle,
          icon: formData.icon,
        })
      } else {
        await addCategory({
          title: trimmedTitle,
          icon: formData.icon,
        })
      }

      await loadCategories()
      setEditingCategory(null)
      setIsAdding(false)
      setFormData({ id: '', title: '', icon: 'Leaf' })
    } catch (err) {
      console.error(err)
      setError('Failed to save category. Check Firebase configuration and rules.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? All items in it will be deleted.')) {
      await deleteCategory(categoryId)
      await loadCategories()
    }
  }

  const handleCancel = () => {
    setEditingCategory(null)
    setIsAdding(false)
    setError(null)
    setFormData({ id: '', title: '', icon: 'Leaf' })
  }

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAdd}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors soft-shadow"
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
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                  {error}
                </div>
              )}
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
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors soft-shadow disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save'}
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
