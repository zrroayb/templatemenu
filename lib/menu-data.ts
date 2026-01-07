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

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  tags: string[]
  imageUrl?: string
}

export interface MenuCategory {
  id: string
  title: string
  icon: string
  items: MenuItem[]
}

// Firestore collections and operations
const categoriesCol = () => collection(getDb(), 'categories')
const itemsCol = (categoryId: string) => collection(getDb(), 'categories', categoryId, 'items')

export async function getMenuData(): Promise<MenuCategory[]> {
  const catsSnap = await getDocs(query(categoriesCol(), orderBy('title', 'asc')))
  const categories: MenuCategory[] = []
  for (const catDoc of catsSnap.docs) {
    const catId = catDoc.id
    const cat = catDoc.data() as Omit<MenuCategory, 'items'>
    const itemsSnap = await getDocs(query(itemsCol(catId), orderBy('name', 'asc')))
    const items: MenuItem[] = itemsSnap.docs.map(d => d.data() as MenuItem)
    categories.push({
      id: catId,
      title: cat.title,
      icon: cat.icon,
      items,
    })
  }
  return categories
}

// Category CRUD
export async function addCategory(category: Omit<MenuCategory, 'items'>): Promise<void> {
  const ref = doc(categoriesCol(), category.id)
  await setDoc(ref, { title: category.title, icon: category.icon })
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

// Backwards-compat no-op (kept to avoid breaking imports)
export function setMenuData(_: MenuCategory[]): void {
  // no-op; Firestore is the source of truth
}

