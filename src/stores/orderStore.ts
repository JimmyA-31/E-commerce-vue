import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { CartItem } from './cartStore'

export type OrderStatus = 'procesando' | 'enviado' | 'entregado' | 'cancelado'

export interface Order {
  id: string
  date: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  status: OrderStatus
  shippingInfo: {
    name: string
    address: string
    city: string
    zip: string
    country: string
  }
}

const ORDERS_KEY = 'vue-tienda-orders'

// Versión de prueba (minutos, para ver el cambio rápido)
function computeStatus(dateISO: string): OrderStatus {
  const minutesSince = (Date.now() - new Date(dateISO).getTime()) / (1000 * 60)
  if (minutesSince < 3) return 'procesando'
  if (minutesSince < 5) return 'enviado'
  return 'entregado'
}

export const useOrderStore = defineStore('orders', () => {

  const savedOrders = localStorage.getItem(ORDERS_KEY)
  const initialOrders: Order[] = savedOrders ? JSON.parse(savedOrders) : []

  const orders = ref<Order[]>(initialOrders)

  const sortedOrders = computed(() =>
    [...orders.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  )

  watch(orders, (newOrders) => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders))
  }, { deep: true })

  function generateOrderId(): string {
    return `PED-${Math.floor(Math.random() * 900000) + 100000}`
  }

  function addOrder(data: {
    items: CartItem[]
    subtotal: number
    shipping: number
    total: number
    shippingInfo: Order['shippingInfo']
  }): Order {
    const newOrder: Order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      status: 'procesando',
      ...data
    }
    orders.value.push(newOrder)
    return newOrder
  }

    function getStatus(order: Order): OrderStatus {
    if (order.status === 'cancelado') return 'cancelado'
    return computeStatus(order.date)
    }

    function canCancel(order: Order): boolean {
    return getStatus(order) === 'procesando'
    }

    function cancelOrder(orderId: string) {
    const order = orders.value.find(o => o.id === orderId)
    if (!order) return
    if (!canCancel(order)) return
    order.status = 'cancelado'
    }

    function getOrderById(id: string): Order | undefined {
        return orders.value.find(o => o.id === id)
    }

    function clearAllOrders() {
    orders.value = []
    }

    return {
    orders,
    sortedOrders,
    addOrder,
    getStatus,
    getOrderById,
    canCancel,
    cancelOrder,
    clearAllOrders
    }
})