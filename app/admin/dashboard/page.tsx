'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { MenuManager } from '@/components/admin/MenuManager'
import { CategoryManager } from '@/components/admin/CategoryManager'
import { Settings, Menu as MenuIcon, Grid, BarChart3, Home } from 'lucide-react'
import Link from 'next/link'
import { getMenuData } from '@/lib/menu-data'

type TabType = 'menu' | 'categories' | 'settings'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('menu')
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

  const updateStats = () => {
    const menuData = getMenuData()
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
      const interval = setInterval(updateStats, 1000)
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
              Manage your menu items and categories
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm soft-shadow hover:soft-shadow-hover transition-all text-foreground/70 hover:text-foreground"
          >
            <Home className="w-4 h-4" />
            View Menu
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={MenuIcon}
            label="Total Items"
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
        <div className="flex gap-2 border-b border-foreground/10">
          {[
            { id: 'menu' as TabType, label: 'Menu Items', icon: MenuIcon },
            { id: 'categories' as TabType, label: 'Categories', icon: Grid },
            { id: 'settings' as TabType, label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-foreground'
                  : 'text-foreground/50 hover:text-foreground/70'
              }`}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'menu' && <MenuManager />}
          {activeTab === 'categories' && <CategoryManager />}
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
        <div className={`p-3 rounded-xl bg-white/50 backdrop-blur-sm ${color}`}>
          <Icon className="w-5 h-5 text-foreground/70" />
        </div>
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-foreground/60 font-light">{label}</div>
    </motion.div>
  )
}

function SettingsPanel() {
  return (
    <div className="glass-effect rounded-3xl p-8 soft-shadow">
      <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-2">
            Restaurant Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
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
  )
}

