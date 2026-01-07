'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

interface MenuItemProps {
  item: {
    id: number
    name: string
    description: string
    price: number
    tags: string[]
    imageUrl?: string
  }
  index: number
}

export function MenuItem({ item, index }: MenuItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="glass-effect rounded-3xl p-6 md:p-8 soft-shadow hover:soft-shadow-hover transition-all duration-300 cursor-pointer"
      >
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Image */}
          {item.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 + 0.1 }}
              className="flex-shrink-0 w-full md:w-32 h-32 md:h-32 rounded-2xl overflow-hidden soft-shadow relative"
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 128px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </motion.div>
          )}
          
          {/* Content */}
          <div className="flex-1 space-y-3 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground group-hover:text-foreground/90 transition-colors flex-1">
                {item.name}
              </h3>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + 0.2 }}
                className="flex-shrink-0"
              >
                <span className="font-serif text-xl md:text-2xl font-bold text-foreground">
                  ${item.price}
                </span>
              </motion.div>
            </div>
            
            <motion.p
              initial={{ opacity: 0.7 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.3 }}
              className="text-foreground/70 text-sm md:text-base font-light leading-relaxed max-w-2xl"
            >
              {item.description}
            </motion.p>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {item.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/60 dark:bg-white/10 backdrop-blur-sm text-foreground/60 dark:text-foreground/50 border border-foreground/10 dark:border-foreground/20"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Decorative accent line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent mt-4"
        />
      </motion.div>
    </motion.div>
  )
}

