<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/ProductCard.vue'
import CategoryBanners from '../components/Categorybanners.vue'
import FeaturedProducts from '../components/Featureproducts.vue'
import TestimonialsCarousel from '../components/Testimonialscarousel.vue'
import NewsletterBanner from '../components/NewsletterBanner.vue'

const {
  categories,
  selectedCategory,
  search,
  loading,
  filteredProducts,
  loadProducts
} = useProducts()

const categoryMap: Record<string, string> = {
  ropa: 'all',
  accesorios: 'jewelery',
  tecnologia: 'electronics'
}

onMounted(loadProducts)

const featuredProducts = computed(() => filteredProducts.value.slice(0, 8))

function scrollToProducts() {
  document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
}

function onCategorySelect(slug: string) {
  selectedCategory.value = categoryMap[slug] ?? 'all'
  scrollToProducts()
}
</script>

<template>
  <main>
    <!-- Hero (sin cambios) -->
    <section class="hero">
      <div class="hero-content">
        <span class="hero-badge">🔥 Nuevos productos cada semana</span>
        <h1 class="font-display">Descubre tu <span class="gradient-text">estilo único</span></h1>
        <p>Los mejores productos al mejor precio. Envío gratis en compras mayores a $50.</p>
        <div class="hero-actions">
          <button class="btn-primary" @click="scrollToProducts">
            Ver productos ↓
          </button>
          <button class="btn-secondary">Ver ofertas 🏷️</button>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <strong>10k+</strong>
            <span>Clientes</span>
          </div>
          <div class="stat">
            <strong>500+</strong>
            <span>Productos</span>
          </div>
          <div class="stat">
            <strong>4.9⭐</strong>
            <span>Rating</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-blob"></div>
        <div class="floating-card card-1">👟 Moda</div>
        <div class="floating-card card-2">💎 Premium</div>
        <div class="floating-card card-3">🚀 Envío rápido</div>
      </div>
    </section>

    <!-- Franja de beneficios -->
    <section class="perks">
      <div class="perk">
        <span class="perk-icon">🚚</span>
        <div>
          <strong>Envío gratis</strong>
          <span>En compras mayores a $50</span>
        </div>
      </div>
      <div class="perk">
        <span class="perk-icon">↩️</span>
        <div>
          <strong>Devoluciones fáciles</strong>
          <span>30 días para cambios</span>
        </div>
      </div>
      <div class="perk">
        <span class="perk-icon">🔒</span>
        <div>
          <strong>Pago seguro</strong>
          <span>Protección en cada compra</span>
        </div>
      </div>
      <div class="perk">
        <span class="perk-icon">⭐</span>
        <div>
          <strong>4.9/5</strong>
          <span>+10,000 clientes felices</span>
        </div>
      </div>
    </section>

    <!-- Banners de categoría -->
    <CategoryBanners @select="onCategorySelect" />

    <!-- Destacados / más vendidos (scroll horizontal) -->
    <FeaturedProducts :products="featuredProducts" />

    <!-- Catálogo completo (sin cambios) -->
    <section id="productos" class="products-section">
      <div class="section-header">
        <span class="ribbon">Catálogo completo</span>
        <h2 class="font-display">Nuestros <span class="accent">Productos</span></h2>
        <p>Encuentra exactamente lo que buscas</p>
      </div>

      <!-- Buscador -->
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar productos..."
          class="search"
        />
        <span v-if="search" class="clear-search" @click="search = ''">✕</span>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <button
          :class="{ active: selectedCategory === 'all' }"
          @click="selectedCategory = 'all'"
        >
          Todos
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando productos...</p>
      </div>

      <!-- Grid -->
      <TransitionGroup name="list" tag="div" class="grid" v-else>
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

      <!-- Sin resultados -->
      <div v-if="!loading && filteredProducts.length === 0" class="empty">
        <p>😕 No encontramos productos con ese criterio</p>
        <button class="btn-primary" @click="search = ''; selectedCategory = 'all'">
          Limpiar filtros
        </button>
      </div>
    </section>

    <!-- Testimonios (carrusel con transición) -->
    <TestimonialsCarousel />

    <!-- CTA Newsletter -->
    <NewsletterBanner />
  </main>
</template>

<style scoped>
main {
  background: var(--cream, var(--bg));
}

/* Hero */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 48px;
  background: var(--white);
  overflow: hidden;
  position: relative;
  min-height: 520px;
}

.hero-content {
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  background: var(--peach, #fff3cd);
  color: var(--brick, #856404);
  padding: 8px 16px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  width: fit-content;
}

.hero-content h1 {
  font-size: 52px;
  font-weight: 600;
  line-height: 1.1;
  color: var(--text);
}

.gradient-text {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-content p {
  font-family: var(--font-body);
  font-size: 17px;
  color: var(--gray);
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.btn-primary {
  background: var(--gradient);
  color: white;
  padding: 14px 28px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 15px;
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  box-shadow: var(--shadow-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  padding: 14px 28px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 15px;
}

.btn-secondary:hover {
  background: var(--surface, var(--bg));
}

.hero-stats {
  display: flex;
  gap: 32px;
  margin-top: 8px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat strong {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--primary);
}

.stat span {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--gray);
}

/* Hero visual */
.hero-visual {
  position: relative;
  width: 400px;
  height: 400px;
  flex-shrink: 0;
}

.hero-blob {
  position: absolute;
  width: 380px;
  height: 380px;
  background: var(--gradient);
  border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
  opacity: 0.15;
  animation: blob 6s ease-in-out infinite;
}

@keyframes blob {
  0%, 100% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
  50% { border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%; }
}

.floating-card {
  position: absolute;
  background: white;
  padding: 12px 20px;
  border-radius: 16px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 14px;
  box-shadow: var(--shadow);
  animation: float 3s ease-in-out infinite;
}

.card-1 {
  top: 60px;
  left: 20px;
  animation-delay: 0s;
  color: var(--primary);
}

.card-2 {
  top: 180px;
  right: 10px;
  animation-delay: 1s;
  color: var(--secondary);
}

.card-3 {
  bottom: 80px;
  left: 40px;
  animation-delay: 2s;
  color: var(--brick, #43e97b);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* Franja de beneficios */
.perks {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
  padding: 28px 48px;
  background: var(--surface, var(--white));
  border-bottom: 1px solid rgba(156, 43, 27, 0.08);
}

.perk {
  display: flex;
  align-items: center;
  gap: 12px;
}

.perk-icon {
  font-size: 24px;
}

.perk strong {
  display: block;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.perk span {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--gray);
}

/* Productos */
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

.ribbon {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--secondary);
}

.section-header h2 {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 0;
}

.accent {
  color: var(--brick, var(--secondary));
  font-style: italic;
}

.section-header p {
  font-family: var(--font-body);
  color: var(--gray);
  font-size: 16px;
}

/* Buscador */
.search-wrapper {
  position: relative;
  max-width: 480px;
  margin: 0 auto 32px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
}

.search {
  width: 100%;
  padding: 14px 44px;
  border: 2px solid var(--peach, #eee);
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 15px;
  outline: none;
  background: white;
  transition: all 0.2s;
  box-shadow: var(--shadow);
}

.search:focus {
  border-color: var(--primary);
  box-shadow: var(--shadow-hover);
}

.clear-search {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
  cursor: pointer;
}

/* Filtros */
.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 48px;
}

.filters button {
  background: white;
  color: var(--text);
  border: 2px solid var(--peach, #eee);
  padding: 10px 22px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.filters button:hover,
.filters button.active {
  background: var(--gradient);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow);
}

/* Grid */
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: center;
}

/* Loading */
.loading {
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

/* Empty */
.empty {
  text-align: center;
  padding: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: var(--gray);
  font-size: 18px;
}

/* Animaciones */
.list-enter-active,
.list-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (max-width: 900px) {
  .hero { flex-direction: column; text-align: center; padding: 56px 24px; gap: 40px; }
  .hero-content { align-items: center; }
  .hero-visual { width: 280px; height: 280px; }
}

@media (max-width: 768px) {
  .perks { gap: 24px; padding: 20px; justify-content: flex-start; overflow-x: auto; }
  .products-section { padding: 48px 20px; }
}
</style>