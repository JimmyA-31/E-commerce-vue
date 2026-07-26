<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const router = useRouter()

const FREE_SHIPPING_THRESHOLD = 50

const shippingProgress = computed(() =>
  Math.min((cart.total / FREE_SHIPPING_THRESHOLD) * 100, 100)
)
const remainingForFreeShipping = computed(() =>
  Math.max(FREE_SHIPPING_THRESHOLD - cart.total, 0)
)
const hasFreeShipping = computed(() => cart.total >= FREE_SHIPPING_THRESHOLD)
const finalTotal = computed(() =>
  hasFreeShipping.value ? cart.total : cart.total + 9.99
)

function goToCheckout() {
  cart.isOpen = false
  router.push('/checkout')
}
</script>

<template>
  <!-- Overlay -->
  <div
    class="overlay"
    :class="{ active: cart.isOpen }"
    @click="cart.isOpen = false"
  />

  <!-- Sidebar -->
  <aside class="sidebar" :class="{ open: cart.isOpen }">

    <div class="sidebar-header">
      <div class="header-title">
        <span class="cart-emoji">🛒</span>
        <h2 class="font-display">Tu carrito</h2>
        <span class="items-count" v-if="cart.totalItems > 0">{{ cart.totalItems }}</span>
      </div>
      <button class="close-btn" @click="cart.isOpen = false" aria-label="Cerrar carrito">✕</button>
    </div>

    <!-- Barra de progreso envío gratis -->
    <div class="shipping-progress" v-if="cart.items.length > 0">
      <p v-if="hasFreeShipping" class="progress-msg success">
        🎉 ¡Tu pedido tiene envío gratis!
      </p>
      <p v-else class="progress-msg">
        Agrega <strong>${{ remainingForFreeShipping.toFixed(2) }}</strong> más y el envío es gratis
      </p>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: shippingProgress + '%' }"></div>
      </div>
    </div>

    <div class="sidebar-body">

      <!-- Vacío -->
      <div v-if="cart.items.length === 0" class="empty">
        <div class="empty-icon">🛍️</div>
        <h3 class="font-display">Tu carrito está vacío</h3>
        <p>Agrega productos para comenzar</p>
        <button class="btn-shop" @click="cart.isOpen = false">Ver productos</button>
      </div>

      <!-- Items -->
      <TransitionGroup name="cart" tag="div" class="items" v-else>
        <div v-for="item in cart.items" :key="item.id" class="item">
          <div class="item-image">
            <img :src="item.image" :alt="item.title" />
          </div>
          <div class="item-info">
            <p class="item-title">{{ item.title }}</p>
            <div class="item-controls">
              <div class="stepper">
                <button
                  class="step-btn"
                  @click="cart.decreaseQuantity(item.id)"
                  aria-label="Disminuir cantidad"
                >−</button>
                <span class="step-value">{{ item.quantity }}</span>
                <button
                  class="step-btn"
                  @click="cart.increaseQuantity(item.id)"
                  aria-label="Aumentar cantidad"
                >+</button>
              </div>
              <button class="remove-btn" @click="cart.removeFromCart(item.id)" aria-label="Eliminar">
                🗑️
              </button>
            </div>
          </div>
          <p class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</p>
        </div>
      </TransitionGroup>
    </div>

    <!-- Footer -->
    <div class="sidebar-footer" v-if="cart.items.length > 0">
      <div class="summary-line">
        <span>Subtotal</span>
        <span>${{ cart.total.toFixed(2) }}</span>
      </div>
      <div class="summary-line">
        <span>Envío</span>
        <span class="free" v-if="hasFreeShipping">Gratis</span>
        <span v-else>$9.99</span>
      </div>
      <div class="divider"></div>
      <div class="total-line">
        <span>Total</span>
        <span class="total-amount">${{ finalTotal.toFixed(2) }}</span>
      </div>
      <button class="btn-checkout" @click="goToCheckout">
        Finalizar compra →
      </button>
      <button class="btn-clear" @click="cart.clearCart()">
        Vaciar carrito
      </button>
    </div>
  </aside>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(43, 23, 16, 0.45);
  backdrop-filter: blur(4px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 200;
}

.overlay.active {
  opacity: 1;
  pointer-events: all;
}

.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  max-width: 100vw;
  height: 100vh;
  background: var(--white);
  z-index: 300;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  box-shadow: -8px 0 48px rgba(156, 43, 27, 0.18);
}

.sidebar.open {
  transform: translateX(0);
}

/* Header */
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 24px;
  background: var(--gradient);
  color: var(--white);
  flex-shrink: 0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-emoji {
  font-size: 22px;
}

.header-title h2 {
  font-size: 20px;
  font-weight: 600;
}

.items-count {
  background: rgba(255, 255, 255, 0.28);
  padding: 2px 10px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  color: var(--white);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  padding: 0;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: none;
}

/* Barra de progreso */
.shipping-progress {
  padding: 16px 24px;
  background: var(--surface);
  border-bottom: 1px solid var(--cream);
  flex-shrink: 0;
}

.progress-msg {
  font-family: var(--font-body);
  font-size: 12.5px;
  color: var(--ink-soft);
  margin-bottom: 8px;
}

.progress-msg strong {
  color: var(--flame);
}

.progress-msg.success {
  color: var(--brick);
  font-weight: 700;
}

.progress-track {
  height: 6px;
  background: var(--peach);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient);
  border-radius: 999px;
  transition: width 0.4s ease;
}

/* Body */
.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

/* Empty */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 10px;
  text-align: center;
  padding: 48px 0;
}

.empty-icon {
  font-size: 60px;
}

.empty h3 {
  font-size: 19px;
  font-weight: 600;
  color: var(--ink);
}

.empty p {
  font-family: var(--font-body);
  color: var(--ink-soft);
  font-size: 14px;
}

.btn-shop {
  background: var(--gradient);
  color: var(--white);
  margin-top: 10px;
  padding: 12px 28px;
  font-family: var(--font-body);
  font-weight: 700;
}

/* Items */
.items {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: var(--surface);
  border-radius: var(--radius-md);
  transition: box-shadow 0.2s;
}

.item:hover {
  box-shadow: var(--shadow-soft);
}

.item-image {
  width: 64px;
  height: 64px;
  background: var(--white);
  border-radius: var(--radius-sm);
  padding: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-title {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--white);
  border: 1px solid var(--peach);
  border-radius: 999px;
  padding: 2px;
}

.step-btn {
  width: 22px;
  height: 22px;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--brick);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-btn:hover {
  background: var(--peach);
  transform: none;
}

.step-value {
  min-width: 20px;
  text-align: center;
  font-family: var(--font-body);
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink);
}

.remove-btn {
  background: transparent;
  font-size: 13px;
  padding: 4px 6px;
  border-radius: 8px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.remove-btn:hover {
  opacity: 1;
  transform: none;
}

.item-price {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 14px;
  color: var(--flame);
  flex-shrink: 0;
}

/* Footer */
.sidebar-footer {
  padding: 18px 24px 22px;
  border-top: 1px solid var(--cream);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--white);
  flex-shrink: 0;
}

.summary-line,
.total-line {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--ink-soft);
}

.total-line {
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
}

.total-amount {
  font-family: var(--font-display);
  color: var(--brick);
}

.free {
  color: var(--coral);
  font-weight: 700;
}

.divider {
  height: 1px;
  background: var(--cream);
  margin: 2px 0;
}

.btn-checkout {
  background: var(--gradient);
  color: var(--white);
  padding: 14px;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 700;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
}

.btn-checkout:hover {
  box-shadow: var(--shadow-hover);
}

.btn-clear {
  background: transparent;
  color: var(--ink-soft);
  font-family: var(--font-body);
  font-size: 13px;
  padding: 6px;
}

.btn-clear:hover {
  color: var(--flame);
  transform: none;
}

/* Animaciones */
.cart-enter-active,
.cart-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.cart-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.cart-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 480px) {
  .sidebar { width: 100vw; }
}
</style>