<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCartStore } from '../stores/cartStore'

const router = useRouter()
const wishlist = useWishlistStore()
const cart = useCartStore()

function moveToCart(productId: number) {
  const product = wishlist.items.find(i => i.id === productId)
  if (!product) return
  cart.addToCart(product)
  wishlist.removeFromWishlist(productId)
}
</script>

<template>
  <main class="wishlist">

    <div class="page-header">
      <h1>Mis <span class="gradient-text">favoritos</span></h1>
      <p>Productos que guardaste para más adelante</p>
    </div>

    <!-- Vacío -->
    <div v-if="wishlist.items.length === 0" class="empty">
      <div class="empty-icon">🤍</div>
      <h2>Aún no tienes favoritos</h2>
      <p>Explora nuestro catálogo y guarda los productos que más te gusten.</p>
      <button class="btn-primary" @click="router.push('/')">
        Explorar productos →
      </button>
    </div>

    <!-- Grid de favoritos -->
    <div v-else class="wishlist-grid">
      <div v-for="item in wishlist.items" :key="item.id" class="wishlist-card">
        <button
          class="remove-btn"
          @click="wishlist.removeFromWishlist(item.id)"
          aria-label="Quitar de favoritos"
        >
          ✕
        </button>
        <RouterLink :to="`/product/${item.id}`" class="wishlist-img">
          <img :src="item.image" :alt="item.title" />
        </RouterLink>
        <div class="wishlist-info">
          <RouterLink :to="`/product/${item.id}`" class="wishlist-title">
            {{ item.title }}
          </RouterLink>
          <span class="wishlist-category">{{ item.category }}</span>
          <strong class="wishlist-price">${{ item.price.toFixed(2) }}</strong>
          <button class="btn-secondary" @click="moveToCart(item.id)">
            🛒 Añadir al carrito
          </button>
        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>
.wishlist {
  padding: 48px;
  max-width: 1100px;
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

/* Grid */
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.wishlist-card {
  background: white;
  border-radius: var(--radius-md, 16px);
  box-shadow: var(--shadow);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
}

.wishlist-card:hover {
  box-shadow: var(--shadow-hover);
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  background: white;
  color: var(--gray);
  font-size: 13px;
  font-weight: 700;
  box-shadow: var(--shadow-soft, var(--shadow));
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  color: var(--primary);
  transform: none;
}

.wishlist-img {
  display: block;
  background: var(--bg);
  aspect-ratio: 1 / 1;
}

.wishlist-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
}

.wishlist-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.wishlist-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.wishlist-category {
  font-size: 12px;
  color: var(--gray);
  text-transform: capitalize;
}

.wishlist-price {
  font-size: 18px;
  font-weight: 800;
  color: var(--primary);
  margin: 4px 0 8px;
}

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

.btn-secondary {
  background: var(--bg);
  color: var(--text);
  padding: 10px 14px;
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

@media (max-width: 640px) {
  .wishlist {
    padding: 24px 16px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .wishlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 14px;
  }
}
</style>