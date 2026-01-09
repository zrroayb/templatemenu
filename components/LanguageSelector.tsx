'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Languages, Check, ChevronDown } from 'lucide-react'
import { useLanguage, type Language } from '@/contexts/LanguageContext'

const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find(l => l.code === language) || languages[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:bg-white/70 dark:hover:bg-white/20 transition-colors soft-shadow"
        aria-label="Select language"
      >
        <Languages className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
        <span className="text-lg md:text-xl">{currentLang.flag}</span>
        <span className="hidden sm:inline text-sm md:text-base font-medium">
          {currentLang.nativeName}
        </span>
        <ChevronDown 
          className={`w-3 h-3 md:w-4 md:h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 z-20 w-48 md:w-56 glass-effect rounded-2xl p-2 soft-shadow overflow-hidden"
            >
              {languages.map((lang) => {
                const isSelected = language === lang.code
                return (
                  <motion.button
                    key={lang.code}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 md:py-3 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'bg-foreground/10 dark:bg-foreground/20 text-foreground font-semibold'
                        : 'text-foreground/70 hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xl md:text-2xl flex-shrink-0">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm md:text-base font-medium">{lang.nativeName}</div>
                      <div className="text-xs text-foreground/50">{lang.name}</div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0"
                      >
                        <Check className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
