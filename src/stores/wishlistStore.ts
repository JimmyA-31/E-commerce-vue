import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '../services/productService'

const WISHLIST_KEY = 'vue-tienda-wishlist'

export const useWishlistStore = defineStore('wishlist', () => {

  const savedWishlist = localStorage.getItem(WISHLIST_KEY)
  const initialItems: Product[] = savedWishlist ? JSON.parse(savedWishlist) : []

  const items = ref<Product[]>(initialItems)

  const totalItems = computed(() => items.value.length)

  watch(items, (newItems) => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(newItems))
  }, { deep: true })

  function isInWishlist(productId: number): boolean {
    return items.value.some(i => i.id === productId)
  }

  function addToWishlist(product: Product) {
    if (isInWishlist(product.id)) return
    items.value.push(product)
  }

  function removeFromWishlist(productId: number) {
    items.value = items.value.filter(i => i.id !== productId)
  }

  function toggleWishlist(product: Product) {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  function clearWishlist() {
    items.value = []
  }

  return {
    items,
    totalItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist
  }
})