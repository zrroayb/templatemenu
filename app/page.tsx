'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MenuItem } from '@/components/MenuItem'
import { MenuCategory } from '@/components/MenuCategory'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageSelector } from '@/components/LanguageSelector'
import { getMenuData, type MenuCategory as MenuCategoryType } from '@/lib/menu-data'
import { useLanguage } from '@/contexts/LanguageContext'
import { Leaf, Sparkles, Coffee, UtensilsCrossed, type LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Sparkles,
  Coffee,
  UtensilsCrossed,
}

export default function Home() {
  const { language, t } = useLanguage()
  const [menuData, setMenuData] = useState<MenuCategoryType[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('')
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    const load = async () => {
      const data = await getMenuData(language)
      setMenuData(data)
      // Set first category as active initially
      if (data.length > 0 && !activeCategory) {
        setActiveCategory(data[0].id)
      }
    }
    load()
    const interval = setInterval(load, 1500)

    return () => {
      clearInterval(interval)
    }
  }, [language])

  // Handle scroll to detect active category
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200 // Offset for header

      for (const category of menuData) {
        const element = categoryRefs.current[category.id]
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(category.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [menuData])

  const scrollToCategory = (categoryId: string) => {
    const element = categoryRefs.current[categoryId]
    if (element) {
      const headerOffset = 150
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setActiveCategory(categoryId)
    }
  }

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
        {/* Theme Toggle & Language Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="fixed top-4 right-4 md:top-6 md:right-6 z-30 flex items-center gap-2 flex-row-reverse"
        >
          <ThemeToggle />
          <LanguageSelector />
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
              {t('menu', 'Menu')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-foreground/70 font-light max-w-2xl mx-auto"
            >
              {t('subtitle', 'A curated selection of culinary excellence, crafted with care and served with passion')}
            </motion.p>
          </div>
        </motion.header>

        {/* Category Navigation */}
        {menuData.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="sticky top-0 z-20 mb-8 md:mb-12 bg-background/80 dark:bg-background/90 backdrop-blur-md border-b border-foreground/10 dark:border-foreground/20 shadow-sm"
          >
            <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
                  {menuData.map((category) => {
                    const Icon = iconMap[category.icon] || Leaf
                    const isActive = activeCategory === category.id
                    
                    return (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToCategory(category.id)}
                        className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl font-medium transition-all whitespace-nowrap min-w-fit ${
                          isActive
                            ? 'bg-foreground text-background soft-shadow scale-105'
                            : 'bg-white/50 dark:bg-white/10 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:bg-white/70 dark:hover:bg-white/20 soft-shadow'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 ${isActive ? 'text-background' : 'text-foreground/70'}`} />
                        <span className="text-xs md:text-sm lg:text-base font-semibold">{category.title}</span>
                        {category.items.length > 0 && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            isActive
                              ? 'bg-background/20 text-background'
                              : 'bg-foreground/10 text-foreground/60'
                          }`}>
                            {category.items.length}
                          </span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.nav>
        )}

        {/* Menu Categories */}
        <div className="container mx-auto px-6 pb-20">
          <div className="max-w-5xl mx-auto space-y-16">
            {menuData.map((category, index) => (
              <div
                key={category.id}
                ref={(el) => {
                  categoryRefs.current[category.id] = el
                }}
                id={`category-${category.id}`}
              >
                <MenuCategory
                  category={category}
                  index={index}
                />
              </div>
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
            {t('footer', 'Crafted with care • Made with passion')}
          </p>
        </motion.footer>
      </div>
    </main>
  )
}

