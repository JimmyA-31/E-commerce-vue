<script setup lang="ts">
import { onMounted } from 'vue'
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/ProductCard.vue'
import TestimonialsCarousel from '../components/Testimonialscarousel.vue'
import NewsletterBanner from '../components/NewsletterBanner.vue'

const { filteredProducts, loading, loadProducts, selectedCategory } = useProducts()

onMounted(async () => {
  selectedCategory.value = 'all'
  await loadProducts()
})
</script>

<template>
  <main class="offers-view">
    <!-- Hero section -->
    <section class="offers-hero">
      <span class="ribbon">Tiempo limitado</span>
      <h1 class="font-display">Ofertas de la semana</h1>
      <p>Aprovecha antes de que se acaben. Nuevas promociones cada semana.</p>
      <div class="countdown">
        <div class="time-block">
          <span class="time-value">3</span>
          <span class="time-label">días</span>
        </div>
        <div class="time-block">
          <span class="time-value">18</span>
          <span class="time-label">horas</span>
        </div>
        <div class="time-block">
          <span class="time-value">42</span>
          <span class="time-label">minutos</span>
        </div>
      </div>
    </section>

    <!-- Oferta destacada -->
    <section class="featured-offer">
      <div class="offer-content">
        <span class="offer-badge">⚡ MEGA OFERTA</span>
        <h2>Descuento especial del 50%</h2>
        <p>En productos seleccionados. Aplicable a una compra por cliente.</p>
        <button class="btn-primary">Ver ofertas ahora →</button>
      </div>
      <div class="offer-visual">
        <div class="offer-blob"></div>
        <div class="offer-text">Hasta 50% OFF</div>
      </div>
    </section>

    <!-- Beneficios -->
    <section class="offer-benefits">
      <div class="benefit">
        <span class="benefit-icon">🎁</span>
        <strong>Regalos gratis</strong>
        <p>Con compras mayores a $100</p>
      </div>
      <div class="benefit">
        <span class="benefit-icon">🚀</span>
        <strong>Envío express</strong>
        <p>Llega en 24-48 horas</p>
      </div>
      <div class="benefit">
        <span class="benefit-icon">↩️</span>
        <strong>Sin preguntas</strong>
        <p>Devoluciones por 60 días</p>
      </div>
    </section>

    <!-- Productos en oferta -->
    <section class="products-section">
      <div class="section-header">
        <h2 class="font-display">Productos en <span class="accent">Oferta</span></h2>
        <p>{{ filteredProducts.length }} productos disponibles</p>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando ofertas...</p>
      </div>

      <TransitionGroup name="list" tag="div" class="grid" v-else-if="filteredProducts.length">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :id="product.id"
          :title="product.title"
          :price="product.price"
          :image="product.image"
          :description="product.description"
          :category="product.category"
        />
      </TransitionGroup>

      <div v-else class="empty">
        <p>😕 No hay ofertas activas en este momento</p>
        <RouterLink to="/" class="btn-primary">Ver catálogo completo</RouterLink>
      </div>
    </section>

    <!-- Testimonios -->
    <TestimonialsCarousel />

    <!-- Newsletter -->
    <NewsletterBanner />
  </main>
</template>

<style scoped>
.offers-view {
  background: var(--cream, var(--bg));
  min-height: 100vh;
}

.offers-hero {
  text-align: center;
  padding: 64px 24px 40px;
  background: var(--gradient);
  color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.ribbon {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.offers-hero h1 {
  font-size: 38px;
  font-weight: 600;
}

.offers-hero p {
  font-family: var(--font-body);
  font-size: 15px;
  opacity: 0.9;
}

/* Countdown */
.countdown {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 16px;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.time-value {
  font-size: 28px;
  font-weight: 900;
}

.time-label {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.85;
  text-transform: uppercase;
}

/* Featured offer */
.featured-offer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 48px;
  padding: 48px;
  background: var(--white);
}

.offer-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.offer-badge {
  display: inline-block;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  width: fit-content;
}

.offer-content h2 {
  font-size: 32px;
  font-weight: 800;
  color: var(--text);
}

.offer-content p {
  font-family: var(--font-body);
  color: var(--gray);
  font-size: 15px;
}

.btn-primary {
  background: var(--gradient);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  width: fit-content;
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  box-shadow: var(--shadow-hover);
}

/* Offer visual */
.offer-visual {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.offer-blob {
  position: absolute;
  width: 280px;
  height: 280px;
  background: var(--gradient);
  border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
  opacity: 0.15;
  animation: blob 6s ease-in-out infinite;
}

@keyframes blob {
  0%, 100% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
  50% { border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%; }
}

.offer-text {
  position: relative;
  font-size: 56px;
  font-weight: 900;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Benefits */
.offer-benefits {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  padding: 48px;
  background: var(--surface, var(--white));
  border-bottom: 1px solid rgba(156, 43, 27, 0.08);
}

.benefit {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.benefit-icon {
  font-size: 32px;
}

.benefit strong {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.benefit p {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--gray);
}

/* Products */
.products-section {
  padding: 64px 48px;
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
  font-size: 36px;
  font-weight: 600;
}

.accent {
  color: var(--brick, var(--secondary));
  font-style: italic;
}

.section-header p {
  font-family: var(--font-body);
  color: var(--gray);
  font-size: 15px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: center;
}

.loading,
.empty {
  text-align: center;
  padding: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--gray);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--peach, #eee);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.list-enter-active,
.list-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (max-width: 900px) {
  .featured-offer {
    grid-template-columns: 1fr;
    padding: 32px;
    gap: 32px;
  }
  .offer-benefits {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .offers-hero {
    padding: 48px 20px 32px;
  }
  .countdown {
    flex-wrap: wrap;
    gap: 12px;
  }
  .products-section {
    padding: 48px 20px;
  }
}
</style>