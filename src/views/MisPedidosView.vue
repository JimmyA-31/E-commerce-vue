<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/orderStore'
import { useCartStore } from '../stores/cartStore'
import { useToast } from '../composables/usetoast'
import { useConfirm } from '../composables/useConfirm'
import type { Order, OrderStatus } from '../stores/orderStore'

const router = useRouter()
const orderStore = useOrderStore()
const cart = useCartStore()
const toast = useToast()
const { confirmDialog } = useConfirm()

const activeFilter = ref<'todos' | OrderStatus>('todos')
const visibleCount = ref(10)

const filterOptions: { value: 'todos' | OrderStatus; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'procesando', label: 'Procesando' },
  { value: 'enviado', label: 'Enviados' },
  { value: 'entregado', label: 'Entregados' },
  { value: 'cancelado', label: 'Cancelados' }
]

const filteredOrders = computed(() => {
  if (activeFilter.value === 'todos') return orderStore.sortedOrders
  return orderStore.sortedOrders.filter(
    order => orderStore.getStatus(order) === activeFilter.value
  )
})

const visibleOrders = computed(() => filteredOrders.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredOrders.value.length)

function loadMore() {
  visibleCount.value += 10
}

function setFilter(filter: 'todos' | OrderStatus) {
  activeFilter.value = filter
  visibleCount.value = 10
}

async function handleClearAll() {
  const confirmed = await confirmDialog({
    title: 'Borrar historial de prueba',
    message: 'Se eliminarán TODOS los pedidos guardados. Esta acción no se puede deshacer.',
    confirmText: 'Sí, borrar todo',
    cancelText: 'Cancelar',
    danger: true
  })
  if (!confirmed) return

  orderStore.clearAllOrders()
  toast.info('Historial de pedidos borrado')
}

const statusLabels: Record<OrderStatus, string> = {
  procesando: 'Procesando',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado'
}

const statusIcons: Record<OrderStatus, string> = {
  procesando: '⏳',
  enviado: '🚚',
  entregado: '✅',
  cancelado: '❌'
}

async function handleCancel(order: Order) {
  const confirmed = await confirmDialog({
    title: 'Cancelar pedido',
    message: `¿Seguro que deseas cancelar el pedido #${order.id}? Esta acción no se puede deshacer.`,
    confirmText: 'Sí, cancelar',
    cancelText: 'No, mantener',
    danger: true
  })
  if (!confirmed) return

  orderStore.cancelOrder(order.id)
  toast.success('Pedido cancelado correctamente')
}

function formatDate(dateISO: string): string {
  return new Date(dateISO).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function volverAComprar(order: Order) {
  order.items.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      cart.addToCart(item)
    }
  })
  cart.isOpen = true
  toast.success('Productos agregados al carrito')
}
</script>

<template>
  <main class="orders">

    <div class="page-header">
      <h1>Mis <span class="gradient-text">pedidos</span></h1>
      <p>Revisa el estado y detalle de tus compras anteriores</p>
    </div>

    <!-- Filtros -->
    <div v-if="orderStore.orders.length > 0" class="filters">
      <button
        v-for="opt in filterOptions"
        :key="opt.value"
        class="filter-chip"
        :class="{ active: activeFilter === opt.value }"
        @click="setFilter(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>

    <!-- Vacío -->
    <div v-if="filteredOrders.length === 0" class="empty">
      <div class="empty-icon">📦</div>
      <h2>{{ orderStore.orders.length === 0 ? 'Aún no tienes pedidos' : 'No hay pedidos con este filtro' }}</h2>
      <p v-if="orderStore.orders.length === 0">Cuando completes una compra, aparecerá aquí con su estado y detalle.</p>
      <button v-if="orderStore.orders.length === 0" class="btn-primary" @click="router.push('/')">
        Ir a comprar →
      </button>
    </div>

    <!-- Lista de pedidos -->
    <div v-else class="orders-list">

      <span class="results-count">
        Mostrando {{ visibleOrders.length }} de {{ filteredOrders.length }} pedidos
      </span>

      <div v-for="order in visibleOrders" :key="order.id" class="order-card">

        <div class="order-header">
          <div>
            <span class="order-id">#{{ order.id }}</span>
            <span class="order-date">{{ formatDate(order.date) }}</span>
          </div>
          <span class="status-badge" :class="orderStore.getStatus(order)">
            {{ statusIcons[orderStore.getStatus(order)] }}
            {{ statusLabels[orderStore.getStatus(order)] }}
          </span>
        </div>

        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <img :src="item.image" :alt="item.title" />
            <div class="order-item-info">
              <p>{{ item.title }}</p>
              <span>x{{ item.quantity }}</span>
            </div>
            <strong>${{ (item.price * item.quantity).toFixed(2) }}</strong>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-shipping">
            <span>📍 {{ order.shippingInfo.address }}, {{ order.shippingInfo.city }}</span>
          </div>
          <div class="order-total">
            <span>Total</span>
            <strong>${{ order.total.toFixed(2) }}</strong>
          </div>
        </div>

        <div class="order-actions">
          <button class="btn-secondary" @click="volverAComprar(order)">
            🔁 Volver a comprar
          </button>
          <button
            v-if="orderStore.canCancel(order)"
            class="btn-cancel"
            @click="handleCancel(order)"
          >
            ✕ Cancelar pedido
          </button>
        </div>
      </div>

      <button v-if="hasMore" class="btn-load-more" @click="loadMore">
        Ver más pedidos ({{ filteredOrders.length - visibleCount }} restantes)
      </button>

      <button v-if="orderStore.orders.length > 0" class="btn-clear-all" @click="handleClearAll">
        🗑️ Borrar historial de prueba
      </button>
    </div>

  </main>
</template>

<style scoped>
.orders {
  padding: 48px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 900;
}

.page-header p {
  color: var(--gray);
  margin-top: 8px;
}

.gradient-text {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Empty state */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  gap: 14px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
}

.empty h2 {
  font-size: 22px;
  font-weight: 800;
  color: var(--text);
}

.empty p {
  color: var(--gray);
  max-width: 360px;
  line-height: 1.6;
}

/* Lista */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
}

.order-id {
  display: block;
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
}

.order-date {
  display: block;
  font-size: 12px;
  color: var(--gray);
  margin-top: 2px;
  text-transform: capitalize;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.status-badge.procesando {
  background: #fff3cd;
  color: #856404;
}

.status-badge.enviado {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.entregado {
  background: #d1fae5;
  color: #065f46;
}

/* Items */
.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 0;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-item img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  background: var(--bg);
  border-radius: 10px;
  padding: 4px;
  flex-shrink: 0;
}

.order-item-info {
  flex: 1;
  min-width: 0;
}

.order-item-info p {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.order-item-info span {
  font-size: 11px;
  color: var(--gray);
}

.order-item strong {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  white-space: nowrap;
}

/* Footer */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 10px;
}

.order-shipping {
  font-size: 12px;
  color: var(--gray);
  max-width: 60%;
}

.order-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.order-total span {
  font-size: 11px;
  color: var(--gray);
}

.order-total strong {
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
}

/* Buttons */
.btn-primary {
  background: var(--gradient);
  color: white;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  box-shadow: var(--shadow-hover);
}

.results-count {
  font-size: 12px;
  color: var(--gray);
  font-weight: 600;
  margin-bottom: -6px;
}

.btn-secondary {
  background: var(--bg);
  color: var(--text);
  padding: 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  width: 100%;
}

.btn-secondary:hover {
  background: var(--primary);
  color: white;
  transform: none;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.order-actions .btn-secondary {
  flex: 1;
}

.btn-cancel {
  flex: 1;
  background: transparent;
  color: #e8352a;
  border: 2px solid #f8d7d5;
  padding: 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
}

.btn-cancel:hover {
  background: #fff5f4;
  border-color: #e8352a;
  transform: none;
}

.status-badge.cancelado {
  background: #fee2e2;
  color: #991b1b;
}

.filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.filter-chip {
  background: white;
  color: var(--gray);
  border: 2px solid #f0f0f0;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.filter-chip:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: none;
}

.filter-chip.active {
  background: var(--gradient);
  color: white;
  border-color: transparent;
}

.btn-load-more {
  background: white;
  color: var(--primary);
  border: 2px solid var(--primary);
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  width: 100%;
}

.btn-load-more:hover {
  background: var(--primary);
  color: white;
}

.btn-clear-all {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 8px auto 0;
  background: #fff5f4;
  color: #9c2b1b;
  border: 1.5px dashed #f3b8b0;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 700;
  width: fit-content;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-clear-all:hover {
  background: #e8352a;
  color: white;
  border-color: #e8352a;
  border-style: solid;
  transform: none;
}

@media (max-width: 640px) {

  .order-actions {
    flex-direction: column;
  }

  .orders {
    padding: 24px 16px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .order-card {
    padding: 18px;
    border-radius: 16px;
  }

  .order-shipping {
    max-width: 100%;
  }

  .order-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-total {
    align-items: flex-start;
  }
}
</style>