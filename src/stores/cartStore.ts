import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '../services/productService'
import { useConfirm } from '../composables/useConfirm'
import { useToast } from '../composables/useToast'

export interface CartItem extends Product {
  quantity: number
}

const CART_KEY = 'vue-tienda-cart'

export const useCartStore = defineStore('cart', () => {

  const toast = useToast()
  const { confirmDialog } = useConfirm()
  const savedCart = localStorage.getItem(CART_KEY)
  const initialItems: CartItem[] = savedCart ? JSON.parse(savedCart) : []

  const items = ref<CartItem[]>(initialItems)
  const isOpen = ref(false)

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  watch(items, (newItems) => {
    localStorage.setItem(CART_KEY, JSON.stringify(newItems))
  }, { deep: true })

  function addToCart(product: Product) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }

  }

  function removeFromCart(productId: number) {
    items.value = items.value.filter(i => i.id !== productId)
  }

  async function clearCart() {
    const confirmed = await confirmDialog({
    title: 'Borrar productos del carrito',
    message: 'Se eliminarán TODOS los productos del carrito. Esta acción no se puede deshacer.',
    confirmText: 'Sí, borrar todo',
    cancelText: 'Cancelar',
    danger: true
  })
  if (!confirmed) return

    items.value = []
    toast.info('Carrito vaciado')
  }

  function increaseQuantity(productId: number) {
    const item = items.value.find((i) => i.id === productId)
    if (item) item.quantity++
  }

  function decreaseQuantity(productId: number) {
    const item = items.value.find((i) => i.id === productId)
    if (!item) return
    if (item.quantity > 1) {
      item.quantity--
    } else {
      removeFromCart(productId) // si llega a 0, se elimina directamente
    }
  }

  return { items, total, totalItems, isOpen, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity}
})