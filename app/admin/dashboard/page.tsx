'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { CategoryManager } from '@/components/admin/CategoryManager'
import { Settings, Grid, BarChart3, Home, Package, Plus } from 'lucide-react'
import Link from 'next/link'
import { getMenuData } from '@/lib/menu-data'

type TabType = 'management' | 'settings'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('management')
  const [stats, setStats] = useState({ totalItems: 0, categories: 0, avgPrice: 0 })
  const router = useRouter()

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth')
    if (auth !== 'true') {
      router.push('/admin')
    } else {
      setIsAuthenticated(true)
      updateStats()
    }
  }, [router])

  const updateStats = async () => {
    const menuData = await getMenuData()
    const totalItems = menuData.reduce((sum, cat) => sum + cat.items.length, 0)
    const categories = menuData.length
    const allPrices = menuData.flatMap(cat => cat.items.map(item => item.price))
    const avgPrice = allPrices.length > 0 
      ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length 
      : 0

    setStats({ totalItems, categories, avgPrice })
  }

  useEffect(() => {
    if (isAuthenticated) {
      updateStats()
      const interval = setInterval(updateStats, 1500)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    router.push('/admin')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-foreground/60 font-light">
              Manage your products and categories
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm soft-shadow hover:soft-shadow-hover transition-all text-foreground/70 hover:text-foreground"
          >
            <Home className="w-4 h-4" />
            View Menu
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={Package}
            label="Total Products"
            value={stats.totalItems}
            color="bg-soft-sage/20"
            delay={0.1}
          />
          <StatCard
            icon={Grid}
            label="Categories"
            value={stats.categories}
            color="bg-soft-blush/20"
            delay={0.2}
          />
          <StatCard
            icon={BarChart3}
            label="Avg. Price"
            value={`$${stats.avgPrice.toFixed(2)}`}
            color="bg-soft-mist/20"
            delay={0.3}
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-foreground/10 dark:border-foreground/20 pb-1">
          {[
            { id: 'management' as TabType, label: 'Menu Management', icon: Grid, description: 'Products & Categories' },
            { id: 'settings' as TabType, label: 'Settings', icon: Settings, description: 'General Settings' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium transition-all relative group rounded-t-xl ${
                activeTab === tab.id
                  ? 'text-foreground bg-white/30 dark:bg-white/10'
                  : 'text-foreground/50 hover:text-foreground/70 hover:bg-white/10 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-foreground' : 'text-foreground/50'}`} />
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold">{tab.label}</span>
                  <span className={`text-xs font-light ${
                    activeTab === tab.id ? 'text-foreground/70' : 'text-foreground/40'
                  }`}>
                    {tab.description}
                  </span>
                </div>
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'management' && <CategoryManager />}
          {activeTab === 'settings' && <SettingsPanel />}
        </motion.div>
      </div>
    </AdminLayout>
  )
}

function StatCard({ icon: Icon, label, value, color, delay }: {
  icon: any
  label: string
  value: number | string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`glass-effect rounded-2xl p-6 soft-shadow ${color}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm ${color}`}>
          <Icon className="w-5 h-5 text-foreground/70" />
        </div>
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-foreground/60 font-light">{label}</div>
    </motion.div>
  )
}

function SettingsPanel() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSeedData = async () => {
    if (confirm('This will add multilingual sample menu data (TR, EN, RU) to Firebase. Continue?')) {
      setIsSeeding(true)
      setSeedMessage(null)
      
      try {
        const { seedMenuDataMultilingual } = await import('@/lib/seed-menu-data-multilang')
        await seedMenuDataMultilingual()
        setSeedMessage({ type: 'success', text: 'Multilingual menu data added successfully! Refresh the page to see the changes.' })
      } catch (error: any) {
        console.error('Error seeding data:', error)
        setSeedMessage({ type: 'error', text: error.message || 'Failed to add sample data. Please try again.' })
      } finally {
        setIsSeeding(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-3xl p-8 soft-shadow">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Settings</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Restaurant Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-foreground/10 dark:border-foreground/20 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="Enter restaurant name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
              placeholder="Enter description"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors soft-shadow"
          >
            Save Settings
          </motion.button>
        </div>
      </div>

      {/* Seed Data Section */}
      <div className="glass-effect rounded-3xl p-8 soft-shadow">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Sample Data</h2>
        <p className="text-foreground/60 font-light mb-6">
          Add a complete sample menu with categories and products to get started quickly.
        </p>
        
        {seedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl mb-4 ${
              seedMessage.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <p className={`font-medium ${
              seedMessage.type === 'success'
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            }`}>
              {seedMessage.text}
            </p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSeedData}
          disabled={isSeeding}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors soft-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSeeding ? (
            <>
              <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
              Adding Sample Data...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add Sample Menu Data
            </>
          )}
        </motion.button>

        <div className="mt-4 p-4 rounded-xl bg-white/30 dark:bg-white/5 border border-foreground/10">
          <p className="text-sm text-foreground/70 font-medium mb-2">What will be added:</p>
          <ul className="text-sm text-foreground/60 space-y-1 list-disc list-inside">
            <li>4 Categories: Appetizers, Main Courses, Desserts, Beverages</li>
            <li>22 Products with multilingual content (Turkish, English, Russian)</li>
            <li>Descriptions, prices, and tags in all languages</li>
            <li>Product images from Unsplash</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

