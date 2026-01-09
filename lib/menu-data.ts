// Centralized menu data store - Firestore-backed
'use client'

import { getDb } from './firebase'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import type { Language } from '@/contexts/LanguageContext'

export interface Translations {
  en: string
  tr: string
  ru: string
}

export interface MenuItem {
  id: number
  name: string | Translations // Backwards compatible: string or Translations object
  description: string | Translations
  price: number
  tags: string[] | { [key: string]: string[] } // Backwards compatible: array or object with translations
  imageUrl?: string
  order?: number // For custom sorting
}

export interface MenuCategory {
  id: string
  title: string | Translations // Backwards compatible: string or Translations object (raw from Firebase)
  icon: string
  items: MenuItem[]
}

// Returned category from getMenuData is always translated to string
export interface TranslatedMenuCategory {
  id: string
  title: string // Always translated to current language
  icon: string
  items: TranslatedMenuItem[]
}

export interface TranslatedMenuItem {
  id: number
  name: string // Always translated to current language
  description: string // Always translated to current language
  price: number
  tags: string[] // Always translated to current language
  imageUrl?: string
  order?: number
}

// Firestore collections and operations
const categoriesCol = () => collection(getDb(), 'categories')
const itemsCol = (categoryId: string) => collection(getDb(), 'categories', categoryId, 'items')

// Helper functions to get translated text
function getTranslatedText(text: string | Translations | undefined, language: Language, fallback = ''): string {
  if (!text) return fallback
  if (typeof text === 'string') return text
  return text[language] || text.en || text.tr || text.ru || fallback
}

function getTranslatedTags(tags: string[] | { [key: string]: string[] } | undefined, language: Language): string[] {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  return tags[language] || tags.en || tags.tr || tags.ru || []
}

export async function getMenuData(language: Language = 'en'): Promise<TranslatedMenuCategory[]> {
  // Get all categories - can't order by title if it's an object, so we'll sort after
  const catsSnap = await getDocs(categoriesCol())
  const categories: TranslatedMenuCategory[] = []
  
  for (const catDoc of catsSnap.docs) {
    const catId = catDoc.id
    const catData = catDoc.data()
    const catTitle = catData.title // Can be string or Translations object
    
    const itemsSnap = await getDocs(itemsCol(catId))
    const itemsRaw: MenuItem[] = itemsSnap.docs.map(d => d.data() as MenuItem)
    
    // Sort by order field if exists, otherwise by name
    itemsRaw.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order
      }
      if (a.order !== undefined) return -1
      if (b.order !== undefined) return 1
      const nameA = typeof a.name === 'string' ? a.name : (a.name as Translations)?.[language] || (a.name as Translations)?.en || ''
      const nameB = typeof b.name === 'string' ? b.name : (b.name as Translations)?.[language] || (b.name as Translations)?.en || ''
      return nameA.localeCompare(nameB)
    })
    
    // Get translated category title (always returns string)
    const translatedTitle = getTranslatedText(catTitle, language, catId)
    
    // Map items with translations (always returns strings)
    const translatedItems: TranslatedMenuItem[] = itemsRaw.map(item => ({
      id: item.id,
      name: getTranslatedText(item.name, language, ''),
      description: getTranslatedText(item.description, language, ''),
      price: item.price,
      tags: getTranslatedTags(item.tags, language),
      imageUrl: item.imageUrl,
      order: item.order,
    }))
    
    categories.push({
      id: catId,
      title: translatedTitle, // Always string after translation
      icon: catData.icon,
      items: translatedItems,
    })
  }
  
  // Sort categories by translated title (already strings)
  categories.sort((a, b) => a.title.localeCompare(b.title))
  
  return categories
}

// Get raw menu data (untranslated) - for admin panel
export async function getRawMenuData(): Promise<MenuCategory[]> {
  const catsSnap = await getDocs(categoriesCol())
  const categories: MenuCategory[] = []
  
  for (const catDoc of catsSnap.docs) {
    const catId = catDoc.id
    const catData = catDoc.data()
    
    const itemsSnap = await getDocs(itemsCol(catId))
    const items: MenuItem[] = itemsSnap.docs.map(d => d.data() as MenuItem)
    
    // Sort by order
    items.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order
      }
      if (a.order !== undefined) return -1
      if (b.order !== undefined) return 1
      return 0
    })
    
    categories.push({
      id: catId,
      title: catData.title as string | Translations,
      icon: catData.icon,
      items,
    })
  }
  
  return categories
}

// Category CRUD
export async function addCategory(category: Omit<MenuCategory, 'items'>): Promise<void> {
  const ref = doc(categoriesCol(), category.id)
  // Ensure title is saved correctly (can be string or Translations object)
  const titleData = typeof category.title === 'string' 
    ? category.title 
    : category.title
  await setDoc(ref, { title: titleData, icon: category.icon })
}

export async function updateCategory(categoryId: string, updates: Partial<Omit<MenuCategory, 'id' | 'items'>>): Promise<void> {
  const ref = doc(categoriesCol(), categoryId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  await updateDoc(ref, updates as any)
}

export async function deleteCategory(categoryId: string): Promise<void> {
  // Delete items in subcollection first (simple iteration)
  const snap = await getDocs(itemsCol(categoryId))
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)))
  await deleteDoc(doc(categoriesCol(), categoryId))
}

// Item CRUD
export async function addMenuItem(categoryId: string, item: Omit<MenuItem, 'id'>): Promise<void> {
  const id = Date.now()
  await setDoc(doc(itemsCol(categoryId), String(id)), { ...item, id })
}

export async function updateMenuItem(categoryId: string, itemId: number, updates: Partial<MenuItem>): Promise<void> {
  const q = query(itemsCol(categoryId), where('id', '==', itemId))
  const snap = await getDocs(q)
  const docRef = snap.docs[0]?.ref
  if (!docRef) return
  await updateDoc(docRef, updates as any)
}

export async function deleteMenuItem(categoryId: string, itemId: number): Promise<void> {
  const q = query(itemsCol(categoryId), where('id', '==', itemId))
  const snap = await getDocs(q)
  const docRef = snap.docs[0]?.ref
  if (!docRef) return
  await deleteDoc(docRef)
}

// Update item order
export async function updateItemOrder(categoryId: string, itemId: number, newOrder: number): Promise<void> {
  await updateMenuItem(categoryId, itemId, { order: newOrder })
}

// Reorder items in a category (batch update)
export async function reorderItems(categoryId: string, itemIds: number[]): Promise<void> {
  const updates = itemIds.map((itemId, index) => 
    updateMenuItem(categoryId, itemId, { order: index })
  )
  await Promise.all(updates)
}

// Backwards-compat no-op (kept to avoid breaking imports)
export function setMenuData(_: MenuCategory[]): void {
  // no-op; Firestore is the source of truth
}

