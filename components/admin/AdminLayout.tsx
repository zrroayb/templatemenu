'use client'

import { motion } from 'framer-motion'
import { LogOut, Shield } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

interface AdminLayoutProps {
  children: React.ReactNode
  onLogout: () => void
}

export function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
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
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 p-6 z-20 hidden md:block">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full glass-effect rounded-3xl p-6 soft-shadow flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm soft-shadow">
              <Shield className="w-5 h-5 text-foreground/70" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">Admin</h2>
              <p className="text-xs text-foreground/50">Control Panel</p>
            </div>
          </div>

          <div className="flex-1" />

          <div className="space-y-3">
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogout}
              className="w-full py-3 px-4 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm soft-shadow hover:soft-shadow-hover transition-all flex items-center justify-center gap-2 text-foreground/70 hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </motion.div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-20 p-4">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-effect rounded-2xl p-4 soft-shadow flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm soft-shadow">
              <Shield className="w-5 h-5 text-foreground/70" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-foreground">Admin</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="p-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm soft-shadow"
            >
              <LogOut className="w-5 h-5 text-foreground/70" />
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8 relative z-10 pt-20 md:pt-8">
        <div className="max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}

