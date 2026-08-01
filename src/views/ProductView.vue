<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductById } from '../services/productService'
import { useProducts } from '../composables/useProducts'
import { useCartStore } from '../stores/cartStore'
import ProductCard from '../components/ProductCard.vue'
import TestimonialsCarousel from '../components/Testimonialscarousel.vue'
import NewsletterBanner from '../components/NewsletterBanner.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { useWishlistStore } from '../stores/wishlistStore'
import { useToast } from '../composables/useToast'


const toast = useToast()
const wishlist = useWishlistStore()
const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const { filteredProducts, loadProducts } = useProducts()

const added = ref(false)
const quantity = ref(1)
const product = ref()
const loading = ref(true)

async function fetchProduct(productId: number) {
  loading.value = true
  quantity.value = 1
  product.value = await getProductById(productId)
  loading.value = false
}

onMounted(async () => {
  await loadProducts()
  await fetchProduct(Number(route.params.id))
})

// Se dispara cada vez que cambia el :id en la URL, aunque el componente no se destruya
watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchProduct(Number(newId))
  }
)

const relatedProducts = computed(() => {
  if (!product.value) return []
  return filteredProducts.value
    .filter(p => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 4)
})

function agregar() {
  if (product.value) {
    for (let i = 0; i < quantity.value; i++) {
      cart.addToCart(product.value)
    }
    added.value = true
    toast.success(`${product.value.title} agregado al carrito`)
    setTimeout(() => added.value = false, 1500)
  }
}

function toggleFavorite() {
  if (!product.value) return
  wishlist.toggleWishlist({ ...product.value })
  toast.info(
    wishlist.isInWishlist(product.value.id) ? 'Agregado a favoritos ❤️' : 'Quitado de favoritos'
  )
}
</script>

<template>
  <main class="detail">

    <LoadingSpinner v-if="loading" message="Cargando producto..." />

    <template v-else-if="product">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span @click="router.push('/')">Inicio</span>
        <span>›</span>
        <span class="category">{{ product.category }}</span>
        <span>›</span>
        <span class="current">{{ product.title.slice(0, 24) }}...</span>
      </div>

      <div class="product">

        <!-- Imagen -->
        <div class="image-section">
          <div class="image-wrapper">
            <img :src="product.image" :alt="product.title" />
            <span class="category-badge">{{ product.category }}</span>
          </div>
          <div class="image-features">
            <div class="feature">🚚 Envío gratis desde $50</div>
            <div class="feature">🔄 Devolución en 30 días</div>
            <div class="feature">🔒 Pago 100% seguro</div>
          </div>
        </div>

        <!-- Info -->
        <div class="info-section">
          <h1>{{ product.title }}</h1>

          <div class="rating">
            <span class="stars">⭐⭐⭐⭐⭐</span>
            <span class="reviews">128 reseñas</span>
          </div>

          <div class="price-section">
            <span class="price">${{ product.price }}</span>
            <span class="old-price">${{ (product.price * 1.2).toFixed(2) }}</span>
            <span class="discount">-20%</span>
          </div>

          <p class="description">{{ product.description }}</p>

          <div class="divider"></div>

          <!-- Cantidad -->
          <div class="quantity-section">
            <span class="label">Cantidad</span>
            <div class="quantity-controls">
              <button
                class="qty-btn"
                @click="quantity > 1 ? quantity-- : null"
                :disabled="quantity <= 1"
              >−</button>
              <span class="qty-value">{{ quantity }}</span>
              <button class="qty-btn" @click="quantity++">+</button>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Acciones -->
          <div class="actions">
            <button
              class="btn-add"
              :class="{ added }"
              @click="agregar"
            >
              {{ added ? '✓ Agregado al carrito' : '🛒 Agregar al carrito' }}
            </button>

            <button
              class="btn-wishlist"
              :class="{ active: wishlist.isInWishlist(product.id) }"
              @click="toggleFavorite"
              :aria-label="wishlist.isInWishlist(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" :fill="wishlist.isInWishlist(product.id) ? 'currentColor' : 'none'">
                <path d="M12 21s-7-4.35-9-7.25C1 10 5 6 8.5 6 10 6 12 8 12 8s2-2 3.5-2C19 6 23 10 21 13.75 19 16.65 12 21 12 21z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <button class="btn-back" @click="router.push('/')">
            ← Volver a la tienda
          </button>
        </div>
      </div>

      <!-- Información adicional -->
      <section class="product-info">
        <div class="info-card">
          <h3>📋 Especificaciones</h3>
          <div class="spec">
            <span class="spec-label">Categoría:</span>
            <span class="spec-value">{{ product.category }}</span>
          </div>
          <div class="spec">
            <span class="spec-label">Stock:</span>
            <span class="spec-value">En existencia</span>
          </div>
          <div class="spec">
            <span class="spec-label">Garantía:</span>
            <span class="spec-value">12 meses</span>
          </div>
        </div>

        <div class="info-card">
          <h3>🎯 Beneficios</h3>
          <ul class="benefits-list">
            <li>✓ Precio garantizado más bajo</li>
            <li>✓ Producto 100% auténtico</li>
            <li>✓ Empaque seguro y rápido</li>
            <li>✓ Atención al cliente 24/7</li>
          </ul>
        </div>
      </section>

      <!-- Productos relacionados -->
      <section class="related-products" v-if="relatedProducts.length > 0">
        <div class="section-header">
          <h2 class="font-display">Productos <span class="accent">Relacionados</span></h2>
          <p>Otros productos de la misma categoría que te pueden interesar</p>
        </div>
        <div class="related-grid">
          <ProductCard
            v-for="p in relatedProducts"
            :key="p.id"
            :id="p.id"
            :title="p.title"
            :price="p.price"
            :image="p.image"
            :description="p.description"
            :category="p.category"
          />
        </div>
      </section>

      <!-- Testimonios -->
      <TestimonialsCarousel />

      <!-- Newsletter -->
      <NewsletterBanner />
    </template>
  </main>
</template>

<style scoped>
.detail {
  padding: 40px 48px;
  max-width: 1100px;
  margin: 0 auto;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--gray);
  margin-bottom: 40px;
}

.breadcrumb span:first-child {
  cursor: pointer;
  color: var(--primary);
  font-weight: 600;
}

.breadcrumb span:first-child:hover {
  text-decoration: underline;
}

.breadcrumb .category {
  text-transform: capitalize;
  color: var(--primary);
}

.breadcrumb .current {
  color: var(--text);
  font-weight: 500;
}

/* Layout */
.product {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
  margin-bottom: 64px;
}

/* Imagen */
.image-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.image-wrapper {
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 48px;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
}

.image-wrapper img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.image-wrapper:hover img {
  transform: scale(1.05);
}

.category-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--gradient);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.image-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--gray);
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

/* Info */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h1 {
  font-size: 26px;
  font-weight: 800;
  line-height: 1.3;
  color: var(--text);
}

.rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  font-size: 16px;
}

.reviews {
  font-size: 13px;
  color: var(--gray);
}

.price-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.price {
  font-size: 36px;
  font-weight: 900;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.old-price {
  font-size: 18px;
  color: var(--gray);
  text-decoration: line-through;
}

.discount {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}

.description {
  font-size: 14px;
  color: var(--gray);
  line-height: 1.8;
}

.divider {
  height: 1px;
  background: #f0f0f0;
}

/* Cantidad */
.quantity-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.label {
  font-weight: 600;
  font-size: 15px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0;
  border: 2px solid #eee;
  border-radius: 12px;
  overflow: hidden;
}

.qty-btn {
  background: transparent;
  color: var(--text);
  width: 40px;
  height: 40px;
  font-size: 20px;
  border-radius: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover {
  background: var(--bg);
  transform: none;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  width: 48px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  border-left: 2px solid #eee;
  border-right: 2px solid #eee;
  padding: 8px 0;
}

/* Acciones */
.actions {
  display: flex;
  gap: 12px;
}

.btn-add {
  flex: 1;
  background: var(--gradient);
  color: white;
  padding: 16px;
  font-size: 15px;
  border-radius: 14px;
  box-shadow: var(--shadow);
}

.btn-add.added {
  background: var(--gradient-green);
}

.btn-add:hover {
  box-shadow: var(--shadow-hover);
}

.btn-wishlist {
  width: 54px;
  height: 54px;
  background: white;
  border: 2px solid #eee;
  border-radius: 14px;
  font-size: 22px;
  padding: 0;
  color: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-wishlist:hover {
  border-color: var(--secondary);
  transform: none;
}

.btn-back {
  background: transparent;
  color: var(--gray);
  font-size: 13px;
  padding: 0;
  text-align: left;
}

.btn-back:hover {
  color: var(--primary);
  transform: none;
}

/* Product info */
.product-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-bottom: 64px;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.info-card h3 {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--text);
}

.spec {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}

.spec:last-child {
  border-bottom: none;
}

.spec-label {
  color: var(--gray);
  font-weight: 600;
}

.spec-value {
  color: var(--text);
  font-weight: 600;
}

.benefits-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benefits-list li {
  font-size: 13px;
  color: var(--text);
  font-weight: 500;
}

/* Related products */
.related-products {
  margin-bottom: 64px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 600;
}

.accent {
  color: var(--brick, var(--secondary));
  font-style: italic;
}

.section-header p {
  font-family: var(--font-body);
  color: var(--gray);
  font-size: 14px;
}

.related-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: center;
}

.btn-wishlist {
  width: 54px;
  height: 54px;
  background: white;
  border: 2px solid #eee;
  border-radius: 14px;
  padding: 0;
  color: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-wishlist:hover {
  border-color: var(--secondary);
  transform: none;
}

.btn-wishlist.active {
  border-color: var(--secondary);
  background: var(--bg);
  color: var(--secondary);
}

@media (max-width: 900px) {
  .product {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .product-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .detail {
    padding: 20px;
  }
  .image-wrapper {
    min-height: 280px;
    padding: 24px;
  }
}
</style>