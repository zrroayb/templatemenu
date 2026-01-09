'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'tr' | 'en' | 'ru'

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  en: {
    'menu': 'Menu',
    'subtitle': 'A curated selection of culinary excellence, crafted with care and served with passion',
    'footer': 'Crafted with care • Made with passion',
  },
  tr: {
    'menu': 'Menü',
    'subtitle': 'Özenle seçilmiş ve tutkuyla servis edilen mutfak mükemmelliği',
    'footer': 'Özenle hazırlandı • Tutkuyla yapıldı',
  },
  ru: {
    'menu': 'Меню',
    'subtitle': 'Кураторская подборка кулинарного совершенства, созданная с заботой и подаваемая со страстью',
    'footer': 'Создано с заботой • Сделано со страстью',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Only access localStorage on client side
    setIsHydrated(true)
    
    try {
      const savedLanguage = localStorage.getItem('language') as Language | null
      if (savedLanguage && ['tr', 'en', 'ru'].includes(savedLanguage)) {
        setLanguageState(savedLanguage)
        return
      }
    } catch (error) {
      // localStorage not available (SSR)
      console.warn('localStorage not available:', error)
    }

    // Detect browser language (only on client)
    try {
      if (typeof window !== 'undefined' && navigator?.language) {
        const browserLang = navigator.language.split('-')[0]
        if (browserLang === 'tr' || browserLang === 'ru') {
          setLanguageState(browserLang)
          return
        }
      }
    } catch (error) {
      // Navigator not available
      console.warn('Navigator not available:', error)
    }

    // Default to English
    setLanguageState('en')
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    // Only save to localStorage on client side
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', lang)
      } catch (error) {
        console.warn('Failed to save language to localStorage:', error)
      }
    }
  }

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || fallback || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
