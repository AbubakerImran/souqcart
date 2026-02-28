import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  id: string
  productId: string
  name: string
  nameAr?: string
  price: number
  image: string
  vendorId: string
  vendorName: string
  stock: number
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (!get().items.find((i) => i.productId === item.productId)) {
          set({ items: [...get().items, item] })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },
      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId)
      },
    }),
    { name: 'souqcart-wishlist' }
  )
)
