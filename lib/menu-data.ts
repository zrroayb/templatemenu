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
  title: string | Translations // Backwards compatible: string or Translations object
  icon: string
  items: MenuItem[]
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

export async function getMenuData(language: Language = 'en'): Promise<MenuCategory[]> {
  // Get all categories - can't order by title if it's an object, so we'll sort after
  const catsSnap = await getDocs(categoriesCol())
  const categories: MenuCategory[] = []
  
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
    
    // Get translated category title
    const translatedTitle = getTranslatedText(catTitle, language, catId)
    
    // Map items with translations
    const translatedItems: MenuItem[] = itemsRaw.map(item => ({
      ...item,
      name: getTranslatedText(item.name, language, ''),
      description: getTranslatedText(item.description, language, ''),
      tags: getTranslatedTags(item.tags, language),
    }))
    
    categories.push({
      id: catId,
      title: translatedTitle,
      icon: catData.icon,
      items: translatedItems,
    })
  }
  
  // Sort categories by translated title
  categories.sort((a, b) => {
    const titleA = typeof a.title === 'string' ? a.title : a.title[language] || a.title.en || ''
    const titleB = typeof b.title === 'string' ? b.title : b.title[language] || b.title.en || ''
    return titleA.localeCompare(titleB)
  })
  
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

