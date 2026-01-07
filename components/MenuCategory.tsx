'use client'

import { motion } from 'framer-motion'
import { MenuItem } from './MenuItem'
import { Leaf, Sparkles, Coffee, UtensilsCrossed, type LucideIcon } from 'lucide-react'

interface MenuItemData {
  id: number
  name: string
  description: string
  price: number
  tags: string[]
}

interface MenuCategoryProps {
  category: {
    id: string
    title: string
    icon: string
    items: MenuItemData[]
  }
  index: number
}

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Sparkles,
  Coffee,
  UtensilsCrossed,
}

export function MenuCategory({ category, index }: MenuCategoryProps) {
  const Icon = iconMap[category.icon] || Leaf

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="space-y-8"
    >
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="p-3 rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur-sm soft-shadow"
        >
          <Icon className="w-6 h-6 text-foreground/70" />
        </motion.div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
          {category.title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-foreground/20 to-transparent ml-4" />
      </div>

      {/* Menu Items */}
      <div className="grid gap-6 md:gap-8">
        {category.items.map((item, itemIndex) => (
          <MenuItem
            key={item.id}
            item={item}
            index={itemIndex}
          />
        ))}
      </div>
    </motion.section>
  )
}

