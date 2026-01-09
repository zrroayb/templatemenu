'use client'

import { useState, useEffect } from 'react'
import { getDb } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function TestFirebase() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [message, setMessage] = useState('Testing Firebase connection...')
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    async function testConnection() {
      try {
        // Check environment variables
        const requiredVars = [
          'NEXT_PUBLIC_FIREBASE_API_KEY',
          'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
          'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
          'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
          'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
          'NEXT_PUBLIC_FIREBASE_APP_ID',
        ]

        const missingVars: string[] = []
        requiredVars.forEach(varName => {
          if (!process.env[varName]) {
            missingVars.push(varName)
          }
        })

        if (missingVars.length > 0) {
          setStatus('error')
          setMessage(`Missing environment variables: ${missingVars.join(', ')}`)
          return
        }

        // Test Firestore connection
        setMessage('Connecting to Firestore...')
        const db = getDb()
        
        setMessage('Reading categories collection...')
        const categoriesRef = collection(db, 'categories')
        const snapshot = await getDocs(categoriesRef)
        
        const cats: any[] = []
        snapshot.forEach((doc) => {
          cats.push({
            id: doc.id,
            ...doc.data()
          })
        })

        setCategories(cats)
        setStatus('success')
        setMessage(`✅ Successfully connected! Found ${snapshot.size} category/categories.`)
      } catch (error: any) {
        setStatus('error')
        let errorMsg = 'Connection failed: ' + error.message
        
        if (error.code === 'permission-denied') {
          errorMsg = '❌ Permission denied. Please check your Firestore security rules.'
        } else if (error.code === 'unavailable') {
          errorMsg = '❌ Service unavailable. Please check your internet connection and Firebase project settings.'
        } else if (error.message?.includes('API key')) {
          errorMsg = '❌ Invalid API key. Please check your .env.local file.'
        } else if (error.message?.includes('project')) {
          errorMsg = '❌ Invalid project ID. Please check your .env.local file.'
        }
        
        setMessage(errorMsg)
        console.error('Firebase test error:', error)
      }
    }

    testConnection()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-soft-cream to-soft-beige dark:from-soft-dark-cream dark:to-soft-dark-beige p-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-effect rounded-3xl p-8 soft-shadow">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-6">
            Firebase Connection Test
          </h1>

          <div className="space-y-4">
            {/* Environment Variables Check */}
            <div className="p-4 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm">
              <h2 className="font-semibold text-foreground mb-3">Environment Variables:</h2>
              <div className="space-y-2 text-sm">
                {[
                  'NEXT_PUBLIC_FIREBASE_API_KEY',
                  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
                  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
                  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
                  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
                  'NEXT_PUBLIC_FIREBASE_APP_ID',
                ].map((varName) => {
                  const value = process.env[varName]
                  const displayValue = value 
                    ? (varName.includes('KEY') || varName.includes('ID') 
                        ? value.substring(0, 20) + '...' 
                        : value)
                    : '❌ MISSING'
                  return (
                    <div key={varName} className="flex items-center gap-2">
                      <span className={value ? 'text-green-600' : 'text-red-600'}>
                        {value ? '✅' : '❌'}
                      </span>
                      <span className="text-foreground/70 font-mono text-xs">{varName}:</span>
                      <span className="text-foreground/90">{displayValue}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Connection Status */}
            <div className={`p-4 rounded-xl ${
              status === 'testing' ? 'bg-blue-50 dark:bg-blue-900/20' :
              status === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
              'bg-red-50 dark:bg-red-900/20'
            }`}>
              <h2 className="font-semibold text-foreground mb-2">Connection Status:</h2>
              <p className={`font-medium ${
                status === 'testing' ? 'text-blue-700 dark:text-blue-300' :
                status === 'success' ? 'text-green-700 dark:text-green-300' :
                'text-red-700 dark:text-red-300'
              }`}>
                {message}
              </p>
            </div>

            {/* Categories Found */}
            {status === 'success' && categories.length > 0 && (
              <div className="p-4 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm">
                <h2 className="font-semibold text-foreground mb-3">Categories Found:</h2>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-3 rounded-lg bg-white/50 dark:bg-white/10">
                      <div className="font-medium text-foreground">ID: {cat.id}</div>
                      <div className="text-sm text-foreground/70">Title: {cat.title || 'No title'}</div>
                      <div className="text-sm text-foreground/70">Icon: {cat.icon || 'No icon'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status === 'success' && categories.length === 0 && (
              <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                <p className="text-yellow-700 dark:text-yellow-300">
                  ⚠️ Connection successful, but no categories found. The database is empty.
                  <br />
                  You can add categories via the admin panel at <code className="bg-white/50 px-2 py-1 rounded">/admin</code>
                </p>
              </div>
            )}

            {/* Error Details */}
            {status === 'error' && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                <h2 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                  Troubleshooting:
                </h2>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-600 dark:text-red-400">
                  <li>Make sure .env.local file is in the project root</li>
                  <li>Restart the dev server after creating/editing .env.local</li>
                  <li>Check that all environment variables are correct</li>
                  <li>Verify Firestore Database is enabled in Firebase Console</li>
                  <li>Check Firestore security rules allow read access</li>
                </ul>
              </div>
            )}

            <div className="pt-4">
              <a
                href="/"
                className="inline-block px-4 py-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                ← Back to Menu
              </a>
              <a
                href="/admin"
                className="inline-block ml-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm text-foreground hover:bg-white/70 transition-colors"
              >
                Go to Admin Panel →
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

