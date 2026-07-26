<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '../stores/cartStore'

const cart = useCartStore()

const mobileMenuOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')

const categories = [
  { label: 'Ropa', link: '/categoria/ropa' },
  { label: 'Accesorios', link: '/categoria/accesorios' },
  { label: 'Tecnología', link: '/categoria/tecnologia' },
  { label: 'Ofertas', link: '/ofertas' }
]

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="header-wrapper">
    <!-- Barra de anuncio -->
    <div class="announce-bar">
      <span>🚚 Envío gratis en compras mayores a $50 · Cambios sin costo hasta 30 días</span>
    </div>

    <!-- Header principal -->
    <header class="header">
      <div class="header-inner">
        <!-- Menú mobile -->
        <button class="menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Abrir menú">
          <span :class="{ open: mobileMenuOpen }"></span>
        </button>

        <RouterLink to="/" class="logo" @click="closeMobileMenu">
          <span class="logo-icon">⚡</span>
          <span class="logo-text font-display">ShopVue</span>
        </RouterLink>

        <nav class="nav">
          <RouterLink to="/">Inicio</RouterLink>
          <RouterLink v-for="cat in categories" :key="cat.label" :to="cat.link">{{ cat.label }}</RouterLink>
        </nav>

        <div class="actions">
          <!-- Buscador -->
          <div class="search-box" :class="{ active: searchOpen }">
            <button class="icon-btn" @click="searchOpen = !searchOpen" aria-label="Buscar">
              <span>🔍</span>
            </button>
            <input
              v-show="searchOpen"
              v-model="searchQuery"
              type="text"
              placeholder="Buscar productos..."
              class="search-input"
            />
          </div>

          <!-- Wishlist -->
          <button class="icon-btn hide-mobile" aria-label="Favoritos">
            <span>♡</span>
          </button>

          <!-- Cuenta -->
          <button class="icon-btn hide-mobile" aria-label="Mi cuenta">
            <span>👤</span>
          </button>

          <!-- Carrito -->
          <div class="cart-btn" @click="cart.isOpen = true">
            <span class="cart-icon">🛒</span>
            <span class="cart-label">Carrito</span>
            <span class="badge" v-if="cart.totalItems > 0">{{ cart.totalItems }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Menú mobile desplegable -->
    <Transition name="slide">
      <nav v-if="mobileMenuOpen" class="mobile-nav">
        <RouterLink to="/" @click="closeMobileMenu">Inicio</RouterLink>
        <RouterLink v-for="cat in categories" :key="cat.label" :to="cat.link" @click="closeMobileMenu">{{ cat.label }}</RouterLink>
        <div class="mobile-nav-divider"></div>
        <a href="#">♡ Favoritos</a>
        <a href="#">👤 Mi cuenta</a>
      </nav>
    </Transition>
  </div>
</template>

<style scoped>
.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Barra de anuncio */
.announce-bar {
  background: var(--brick);
  color: var(--white);
  text-align: center;
  font-family: var(--font-body);
  font-size: 12.5px;
  font-weight: 600;
  padding: 8px 16px;
  letter-spacing: 0.01em;
}

/* Header principal */
.header {
  background: var(--white);
  box-shadow: var(--shadow-soft);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 16px 48px;
  max-width: 1440px;
  margin: 0 auto;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  padding: 0;
  align-items: center;
  justify-content: center;
}

.menu-toggle span,
.menu-toggle span::before,
.menu-toggle span::after {
  content: '';
  display: block;
  width: 22px;
  height: 2px;
  background: var(--ink);
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.menu-toggle span::before { transform: translateY(-7px); }
.menu-toggle span::after { transform: translateY(5px); }
.menu-toggle span.open { background: transparent; }
.menu-toggle span.open::before { transform: translateY(0) rotate(45deg); }
.menu-toggle span.open::after { transform: translateY(0) rotate(-45deg); }

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 26px;
}

.logo-text {
  font-size: 24px;
  font-weight: 600;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav {
  display: flex;
  gap: 28px;
  flex: 1;
}

.nav a {
  text-decoration: none;
  color: var(--text);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 15px;
  transition: color 0.2s;
  white-space: nowrap;
}

.nav a:hover,
.nav a.router-link-active {
  color: var(--coral);
}

/* Acciones a la derecha */
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.icon-btn {
  background: var(--surface);
  border: 1px solid var(--peach);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  padding: 0;
  color: var(--ink);
  transition: background 0.2s, transform 0.2s;
}

.icon-btn:hover {
  background: var(--peach);
  transform: translateY(-1px);
}

/* Buscador */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-box.active {
  background: var(--surface);
  border: 1px solid var(--peach);
  border-radius: 999px;
  padding: 2px 6px 2px 2px;
}

.search-box.active .icon-btn {
  border: none;
  background: transparent;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-family: var(--font-body);
  font-size: 14px;
  width: 180px;
  color: var(--ink);
}

/* Carrito */
.cart-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--gradient);
  color: var(--white);
  padding: 10px 20px;
  border-radius: 999px;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 600;
  position: relative;
  transition: all 0.2s;
}

.cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.cart-icon {
  font-size: 18px;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--flame);
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  border: 2px solid white;
}

/* Menú mobile */
.mobile-nav {
  display: none;
}

.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

@media (max-width: 900px) {
  .header-inner { padding: 14px 20px; gap: 16px; }
  .nav { display: none; }
  .menu-toggle { display: flex; }
  .hide-mobile { display: none; }
  .search-input { width: 120px; }
  .cart-label { display: none; }
  .announce-bar { font-size: 11px; padding: 6px 12px; }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    background: var(--white);
    padding: 8px 20px 16px;
    box-shadow: var(--shadow-soft);
    overflow: hidden;
  }

  .mobile-nav a {
    text-decoration: none;
    color: var(--ink);
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 15px;
    padding: 12px 4px;
    border-bottom: 1px solid var(--cream);
  }

  .mobile-nav-divider {
    height: 4px;
  }
}
</style>