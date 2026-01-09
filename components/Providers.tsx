'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  )
}
