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
    
    // Validate config
    if (!config.apiKey || !config.projectId || !config.appId) {
      throw new Error('Firebase configuration is missing. Please check your .env.local file.')
    }

    if (!getApps().length) {
      app = initializeApp(config)
    } else {
      app = getApps()[0]!
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



