'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MenuItem } from '@/components/MenuItem'
import { MenuCategory } from '@/components/MenuCategory'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getMenuData, type MenuCategory as MenuCategoryType } from '@/lib/menu-data'

export default function Home() {
  const [menuData, setMenuData] = useState<MenuCategoryType[]>([])

  useEffect(() => {
    setMenuData(getMenuData())
    
    // Listen for storage changes to update menu in real-time
    const handleStorageChange = () => {
      setMenuData(getMenuData())
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Poll for changes (in a real app, use proper state management)
    const interval = setInterval(() => {
      setMenuData(getMenuData())
    }, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-soft-sage/20 dark:bg-soft-dark-sage/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-soft-blush/20 dark:bg-soft-dark-blush/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-soft-mist/10 dark:bg-soft-dark-mist/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="fixed top-6 right-6 z-30"
        >
          <ThemeToggle />
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-6 py-12"
        >
          <div className="text-center space-y-4">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight"
            >
              Menu
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-foreground/70 font-light max-w-2xl mx-auto"
            >
              A curated selection of culinary excellence, crafted with care and served with passion
            </motion.p>
          </div>
        </motion.header>

        {/* Menu Categories */}
        <div className="container mx-auto px-6 pb-20">
          <div className="max-w-5xl mx-auto space-y-16">
            {menuData.map((category, index) => (
              <MenuCategory
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-6 py-12 text-center"
        >
          <p className="text-foreground/60 font-light">
            Crafted with care • Made with passion
          </p>
        </motion.footer>
      </div>
    </main>
  )
}

