<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import type { Product } from '../services/productService'

const props = defineProps<{
  products: Product[]
}>()
</script>

<template>
  <section class="featured" v-if="products.length">
    <div class="section-header">
      <div>
        <span class="ribbon">Tendencia esta semana</span>
        <h2 class="font-display">Más <span class="accent">vendidos</span></h2>
      </div>
    </div>

    <div class="scroll-track">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :id="product.id"
        :title="product.title"
        :price="product.price"
        :image="product.image"
        :description="product.description"
        :category="product.category"
      />
    </div>
  </section>
</template>

<style scoped>
.featured {
  padding: 64px 0 64px 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 28px;
  padding-right: 48px;
}

.ribbon {
  display: block;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--flame);
  margin-bottom: 4px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 600;
  color: var(--ink);
}

.accent {
  color: var(--brick);
  font-style: italic;
}

.scroll-track {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 12px;
  padding-right: 48px;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
  scrollbar-color: var(--peach) transparent;
}

.scroll-track::-webkit-scrollbar {
  height: 8px;
}

.scroll-track::-webkit-scrollbar-thumb {
  background: var(--peach);
  border-radius: 999px;
}

.scroll-track :deep(.card) {
  flex: 0 0 auto;
  scroll-snap-align: start;
}

@media (max-width: 768px) {
  .featured { padding: 48px 0 48px 20px; }
  .section-header { padding-right: 20px; }
  .scroll-track { padding-right: 20px; }
}
</style>