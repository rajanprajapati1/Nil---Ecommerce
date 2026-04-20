import Dexie, { type EntityTable } from 'dexie';
import { Product } from '@/data/products';

// Define the interface for recently viewed items
export interface RecentlyViewed {
  id?: number; // Primary key
  productId: string;
  viewedAt: number;
}

// Define the interface for cart items
export interface CartItem {
  id?: number;
  productId: string;
  size?: string;
  quantity: number;
  addedAt: number;
}

// Define the interface for wishlist items
export interface WishlistItem {
  id?: number;
  productId: string;
  addedAt: number;
}

// Extend Dexie to strongly type our tables
export const db = new Dexie('NilDB') as Dexie & {
  recentlyViewed: EntityTable<RecentlyViewed, 'id'>, // 'id' is primary key
  cart: EntityTable<CartItem, 'id'>, // 'id' is primary key
  wishlist: EntityTable<WishlistItem, 'id'>, // 'id' is primary key
  user: EntityTable<{ id?: number;[key: string]: any }, 'id'> // Placeholder for future
};

// Schema declaration
db.version(1).stores({
  recentlyViewed: '++id, productId, viewedAt', // Primary key and indexed props
  cart: '++id, productId',
  wishlist: '++id, productId',
  user: '++id'
});
