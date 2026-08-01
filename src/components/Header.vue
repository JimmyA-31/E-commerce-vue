<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useUserStore } from '../stores/userStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { useAuth } from '../composables/useAuth'

const cart = useCartStore()
const userStore = useUserStore()
const wishlist = useWishlistStore()
const { openLoginModal, logout } = useAuth()

const mobileMenuOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const showAccountMenu = ref(false)

const categories = [
  { label: 'Ropa', link: '/categoria/ropa' },
  { label: 'Accesorios', link: '/categoria/accesorios' },
  { label: 'Tecnología', link: '/categoria/tecnologia' },
  { label: 'Ofertas', link: '/ofertas' }
]

const accountLabel = computed(() => userStore.isLoggedIn ? `Hola, ${userStore.user?.name}` : 'Mi cuenta')

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function toggleAccountMenu() {
  if (!userStore.isLoggedIn) {
    openLoginModal()
    return
  }
  showAccountMenu.value = !showAccountMenu.value
}

function handleLogout() {
  logout()
  showAccountMenu.value = false
}

// Botón de cuenta en el menú mobile: debe loguear o desloguear según corresponda
function handleMobileAccountClick() {
  if (userStore.isLoggedIn) {
    handleLogout()
  } else {
    openLoginModal()
  }
  closeMobileMenu()
}
</script>

<template>
  <div class="header-wrapper">
    <div class="announce-bar">🚚 Envío gratis en compras mayores a $50 · Cambios sin costo hasta 30 días</div>

    <header class="header">
      <div class="header-inner">
        <button class="menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Abrir menú">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>

        <RouterLink to="/" class="logo" @click="closeMobileMenu">
          <div class="logo-badge">SV</div>
          <span class="logo-text font-display">ShopVue</span>
        </RouterLink>

        <nav class="nav">
          <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          <RouterLink v-for="cat in categories" :key="cat.label" :to="cat.link" class="nav-link">{{ cat.label }}</RouterLink>
        </nav>

        <div class="actions">
          <div class="search-box" :class="{ active: searchOpen }">
            <button class="icon-btn" @click="searchOpen = !searchOpen" aria-label="Buscar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/></svg>
            </button>
            <input v-show="searchOpen" v-model="searchQuery" type="text" placeholder="Buscar productos..." class="search-input" />
          </div>

          <RouterLink to="/favoritos" class="icon-btn hide-mobile" aria-label="Favoritos">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-7-4.35-9-7.25C1 10 5 6 8.5 6 10 6 12 8 12 8s2-2 3.5-2C19 6 23 10 21 13.75 19 16.65 12 21 12 21z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="badge" v-if="wishlist.totalItems > 0">{{ wishlist.totalItems }}</span>
          </RouterLink>

          <div class="account-wrapper">
            <button class="icon-btn" @click="toggleAccountMenu" :aria-label="accountLabel" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.6"/></svg>
            </button>
            <span class="account-label hide-mobile">{{ accountLabel }}</span>
            <div v-if="showAccountMenu" class="account-menu">
              <div v-if="userStore.isLoggedIn" class="account-info">
                <strong>{{ userStore.user?.name }}</strong>
                <small>{{ userStore.user?.email }}</small>
              </div>
              <RouterLink
                v-if="userStore.isLoggedIn"
                to="/mis-pedidos"
                class="menu-item"
                @click="showAccountMenu = false"
              >
                Mis pedidos
              </RouterLink>
              <RouterLink
                v-if="userStore.isLoggedIn"
                to="/favoritos"
                class="menu-item"
                @click="showAccountMenu = false"
              >
                Favoritos
              </RouterLink>
              <button class="menu-item" v-if="userStore.isLoggedIn" @click="handleLogout" type="button">Cerrar sesión</button>
              <button class="menu-item" v-else @click="openLoginModal" type="button">Ingresar</button>
            </div>
          </div>

          <button class="icon-btn cart-btn" @click="cart.isOpen = true" aria-label="Carrito">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6h15l-1.5 9h-11L6 6z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1" fill="currentColor"/><circle cx="18" cy="20" r="1" fill="currentColor"/></svg>
            <span class="badge" v-if="cart.totalItems > 0">{{ cart.totalItems }}</span>
          </button>
        </div>
      </div>
    </header>

    <Transition name="slide">
      <nav v-if="mobileMenuOpen" class="mobile-nav">
        <RouterLink to="/" @click="closeMobileMenu">Inicio</RouterLink>
        <RouterLink v-for="cat in categories" :key="cat.label" :to="cat.link" @click="closeMobileMenu">{{ cat.label }}</RouterLink>
        <div class="mobile-nav-divider"></div>
        <RouterLink to="/favoritos" @click="closeMobileMenu">Favoritos</RouterLink>
        <RouterLink v-if="userStore.isLoggedIn" to="/mis-pedidos" @click="closeMobileMenu">Mis pedidos</RouterLink>
        <button class="mobile-account-btn" @click="handleMobileAccountClick" type="button">
          {{ userStore.isLoggedIn ? 'Cerrar sesión' : 'Mi cuenta' }}
        </button>
      </nav>
    </Transition>
  </div>
</template>

<style scoped>
.header-wrapper { position: sticky; top: 0; z-index: 100 }
.announce-bar { background: var(--brick); color: var(--white); text-align: center; font-family: var(--font-body); font-size: 12.5px; font-weight: 600; padding: 8px 16px }
.header { background: var(--white); box-shadow: var(--shadow-soft); border-bottom: 1px solid rgba(43,23,16,0.04) }
.header-inner { display:flex; align-items:center; gap:24px; padding:12px 28px; max-width:1260px; margin:0 auto }
.logo { display:flex; align-items:center; gap:10px; text-decoration:none }
.logo-badge { width:44px; height:44px; border-radius:10px; background:var(--gradient); color:white; display:flex; align-items:center; justify-content:center; font-weight:800 }
.logo-text { font-size:18px; color:var(--ink); font-weight:800 }
.nav { display:flex; gap:18px; flex:1; align-items:center }
.nav-link { color:var(--ink); font-weight:700; text-decoration:none; padding:8px 10px; border-radius:10px; position:relative }
.nav-link::after { content: ''; position:absolute; left:12px; right:12px; bottom:6px; height:3px; background: transparent; border-radius:4px; transition: background 220ms ease, transform 220ms ease }
.nav-link:hover::after { background: linear-gradient(90deg, var(--peach), var(--coral)); transform: translateY(-2px) }

.actions { display:flex; align-items:center; gap:12px; margin-left:auto }
.search-box { display:flex; align-items:center; gap:8px; background:var(--surface); padding:6px; border-radius:12px; border:1px solid rgba(156,43,27,0.04) }
.search-input { border:0; outline:none; background:transparent; width:180px; padding:6px; font-family: var(--font-body); color: var(--ink) }

.icon-btn,
.menu-toggle {
  background: transparent;
  border: none;
  padding: 0;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink);
  transition: background 160ms ease;
  position: relative;
}
.icon-btn:hover,
.menu-toggle:hover { background: rgba(232,84,63,0.06); transform: none }

.menu-toggle { display: none }

.cart-btn { width: auto; padding: 0 10px !important; gap:8px }
.badge { position:absolute; top:-6px; right:-6px; min-width:18px; height:18px; padding:0 6px; background:var(--coral); color:white; font-size:12px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:700 }

.account-wrapper { position: relative; display:flex; align-items:center; gap:8px }
.account-label { font-size:14px; font-weight:600; color:var(--ink); margin-left:6px }
.account-menu { position:absolute; top:54px; right:0; background:var(--white); border:1px solid rgba(156,43,27,0.06); border-radius:12px; box-shadow:var(--shadow); padding:10px; min-width:200px; z-index:10 }
.account-info { display:flex; flex-direction:column; gap:4px; padding-bottom:8px; border-bottom:1px solid rgba(156,43,27,0.04); margin-bottom:8px }
.menu-item {
  display: block;
  width:100%;
  text-align:left;
  background:none;
  border:none;
  color:var(--ink);
  font-family:var(--font-body);
  font-weight:700;
  padding:10px 8px;
  border-radius:8px;
  text-decoration: none;
}
.menu-item:hover { background:var(--surface); transform:none }

/* Mobile nav */
.mobile-nav {
  display: none;
  flex-direction: column;
  background: var(--white);
  padding: 8px 20px 16px;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}
.mobile-nav a {
  color: var(--ink);
  text-decoration: none;
  font-weight: 700;
  padding: 12px 4px;
}
.mobile-nav-divider {
  height: 1px;
  background: rgba(43,23,16,0.08);
  margin: 8px 0;
}
.mobile-account-btn {
  background: var(--surface);
  color: var(--ink);
  text-align: left;
  padding: 12px !important;
  border-radius: 10px;
  font-weight: 700;
}

@media (max-width:900px) {
  .nav{display:none}
  .menu-toggle{display:flex}
  .hide-mobile{display:none}
  .search-input{width:120px}
  .mobile-nav{display:flex}
  .logo-badge{width:36px;height:36px}
  .logo-text{font-size:16px}
}
</style>