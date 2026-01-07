Firebase setup (Firestore)

1) Create a Firebase project and enable Firestore (Native mode).
2) Create a web app and copy the config.
3) Create a `.env.local` file with:

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

4) Data model:
- Collection `categories` (docId = category.id)
  - title: string
  - icon: string
  - Subcollection `items`
    - id: number
    - name: string
    - description: string
    - price: number
    - tags: string[]
    - imageUrl?: string

That's it. Run dev after setting env: `npm run dev`


