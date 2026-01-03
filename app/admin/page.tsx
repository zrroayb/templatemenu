'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, LogIn } from 'lucide-react'

export default function AdminLogin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      router.push('/admin/dashboard')
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check - in production, use proper authentication
    if (password === 'admin123' || password === 'admin') {
      sessionStorage.setItem('adminAuth', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Invalid password. Try "admin" or "admin123"')
    }
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-soft-sage/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 -right-20 w-96 h-96 bg-soft-blush/20 rounded-full blur-3xl"
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="glass-effect rounded-3xl p-8 md:p-12 soft-shadow">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/50 backdrop-blur-sm soft-shadow mb-4"
            >
              <Lock className="w-8 h-8 text-foreground/70" />
            </motion.div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
              Admin Access
            </h1>
            <p className="text-foreground/60 font-light">
              Enter your password to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground/70 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-foreground/10 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-transparent transition-all"
                placeholder="Enter password"
                autoFocus
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-500"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-foreground text-background font-medium flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors soft-shadow"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-foreground/40">
              Demo: Use "admin" or "admin123"
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

