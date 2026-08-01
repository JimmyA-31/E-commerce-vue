<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/ProductCard.vue'
import TestimonialsCarousel from '../components/Testimonialscarousel.vue'
import NewsletterBanner from '../components/NewsletterBanner.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()

const { products, loading, loadProducts } = useProducts()

const categoryLabel = ref('')
const selectedCategories = ref<string[]>([])

const categoryMap: Record<string, string[]> = {
  tecnologia: ['electronics'],
  accesorios: ['jewelery'],
  joyeria: ['jewelery'],
  hombres: ["men's clothing"],
  mujeres: ["women's clothing"],
  ropa: ["men's clothing", "women's clothing"]
}

const categoryDescriptions: Record<string, string> = {
  tecnologia: 'Descubre los últimos gadgets y dispositivos tecnológicos con las mejores marcas',
  accesorios: 'Joyería elegante y accesibles para todos tus momentos especiales',
  joyeria: 'Joyería elegante y accesible para todos tus momentos especiales',
  hombres: 'Ropa de calidad para hombres con estilo y comodidad garantizada',
  mujeres: 'Moda femenina con las últimas tendencias del mercado',
  ropa: 'Ropa para hombres y mujeres con las últimas tendencias'
}

function applyCategoryFromRoute() {
  const slug = (route.params.slug as string).toLowerCase()
  selectedCategories.value = categoryMap[slug] ?? []
  categoryLabel.value = slug
}

const labels: Record<string, string> = {
  tecnologia: 'Tecnología',
  accesorios: 'Accesorios',
  joyeria: 'Joyería',
  hombres: 'Ropa para hombres',
  mujeres: 'Ropa para mujeres',
  ropa: 'Ropa'
}

const filteredProducts = computed(() => {
  if (selectedCategories.value.length === 0) return []
  return products.value.filter(p => selectedCategories.value.includes(p.category))
})

categoryLabel.value = labels[route.params.slug as string] ?? (route.params.slug as string)

onMounted(async () => {
  await loadProducts()
  applyCategoryFromRoute()
})

watch(() => route.params.slug, applyCategoryFromRoute)
</script>

<template>
  <main class="category-view">
    <!-- Hero section -->
    <section class="category-hero">
      <span class="ribbon">Categoría</span>
      <h1 class="font-display">{{ categoryLabel }}</h1>
      <p>{{ categoryDescriptions[route.params.slug as string] || 'Explora nuestra selección de productos' }}</p>
    </section>

    <!-- Características de la categoría -->
    <section class="category-features">
      <div class="feature">
        <span class="feature-icon">⭐</span>
        <div>
          <strong>Productos premium</strong>
          <span>Seleccionados con cuidado</span>
        </div>
      </div>
      <div class="feature">
        <span class="feature-icon">🚚</span>
        <div>
          <strong>Envío rápido</strong>
          <span>A toda la región</span>
        </div>
      </div>
      <div class="feature">
        <span class="feature-icon">💯</span>
        <div>
          <strong>Garantía</strong>
          <span>Satisfacción 100%</span>
        </div>
      </div>
      <div class="feature">
        <span class="feature-icon">💰</span>
        <div>
          <strong>Mejores precios</strong>
          <span>Grandes descuentos</span>
        </div>
      </div>
    </section>

    <!-- Productos -->
    <section class="products-section">
      <div class="section-header">
        <h2 class="font-display">Nuestros <span class="accent">Productos</span></h2>
        <p>{{ filteredProducts.length }} productos disponibles</p>
      </div>

      <LoadingSpinner v-if="loading" message="Cargando productos..." />

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
        <p>😕 Todavía no tenemos productos en esta categoría</p>
        <RouterLink to="/" class="btn-primary">Volver al inicio</RouterLink>
      </div>
    </section>

    <!-- Testimonios -->
    <TestimonialsCarousel />

    <!-- Newsletter -->
    <NewsletterBanner />
  </main>
</template>

<style scoped>
.category-view {
  background: var(--cream, var(--bg));
  min-height: 100vh;
}

.category-hero {
  text-align: center;
  padding: 64px 24px 40px;
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
  color: var(--flame, var(--secondary));
}

.category-hero h1 {
  font-size: 38px;
  font-weight: 600;
  color: var(--text);
  text-transform: capitalize;
}

.category-hero p {
  font-family: var(--font-body);
  color: var(--gray);
  font-size: 15px;
  max-width: 500px;
}

/* Características de la categoría */
.category-features {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
  padding: 28px 48px;
  background: var(--white);
  border-bottom: 1px solid rgba(156, 43, 27, 0.08);
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-icon {
  font-size: 24px;
}

.feature strong {
  display: block;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.feature span {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--gray);
}

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
  margin-bottom: 0;
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

.empty {
  text-align: center;
  padding: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--gray);
}

.btn-primary {
  background: var(--gradient);
  color: white;
  padding: 12px 24px;
  border-radius: 999px;
  text-decoration: none;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 14px;
  display: inline-block;
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

@media (max-width: 768px) {
  .category-features {
    gap: 24px;
    padding: 20px;
  }
  .products-section {
    padding: 48px 20px;
  }
}
</style>