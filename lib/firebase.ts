'use client'

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'

let app: FirebaseApp | null = null
let db: Firestore | null = null

export function getFirebaseApp(): FirebaseApp {
  // Only initialize on client side
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized on the client side')
  }

  if (!app) {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
    
    // Validate config with detailed error messages
    const missingVars: string[] = []
    if (!config.apiKey) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY')
    if (!config.projectId) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID')
    if (!config.appId) missingVars.push('NEXT_PUBLIC_FIREBASE_APP_ID')
    
    if (missingVars.length > 0) {
      const errorMsg = `Firebase configuration is missing. Missing environment variables: ${missingVars.join(', ')}. Please check your environment variables in your deployment platform (Vercel/Netlify/etc) or .env.local file.`
      console.error('❌ Firebase Config Error:', errorMsg)
      console.error('Current environment:', {
        isProduction: process.env.NODE_ENV === 'production',
        hasApiKey: !!config.apiKey,
        hasProjectId: !!config.projectId,
        hasAppId: !!config.appId,
      })
      throw new Error(errorMsg)
    }

    try {
      if (!getApps().length) {
        app = initializeApp(config)
        console.log('✅ Firebase app initialized successfully')
      } else {
        app = getApps()[0]!
      }
    } catch (error: any) {
      console.error('❌ Firebase initialization error:', error)
      throw new Error(`Failed to initialize Firebase: ${error.message}`)
    }
  }
  return app!
}

export function getDb(): Firestore {
  // Only initialize on client side
  if (typeof window === 'undefined') {
    throw new Error('Firestore can only be accessed on the client side')
  }

  if (!db) {
    db = getFirestore(getFirebaseApp())
  }
  return db
}



