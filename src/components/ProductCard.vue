<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '../stores/cartStore'

const props = defineProps<{
  title: string
  price: number
  image: string
  id: number
  description: string
  category: string
}>()

const cart = useCartStore()
const added = ref(false)

function agregar() {
  cart.addToCart({ ...props })
  added.value = true
  setTimeout(() => (added.value = false), 1500)
}
</script>

<template>
  <article class="card">
    <RouterLink :to="`/product/${id}`" class="card-image-wrapper">
      <img :src="image" :alt="title" />
      <span class="category-badge">{{ category }}</span>
      <div class="card-overlay">
        <span class="overlay-cta">Ver detalle →</span>
      </div>
    </RouterLink>

    <div class="card-body">
      <span class="eyebrow">{{ category }}</span>
      <h3>{{ title }}</h3>

      <div class="card-footer">
        <span class="price">${{ price.toFixed(2) }}</span>
        <button
          class="add-btn"
          :class="{ added }"
          @click="agregar"
        >
          {{ added ? '✓ Agregado' : '+ Carrito' }}
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--white);
  border-radius: var(--radius-md);
  width: 250px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
}

/* Imagen */
.card-image-wrapper {
  position: relative;
  display: block;
  background: var(--surface);
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  transition: transform 0.4s ease;
}

.card:hover img {
  transform: scale(1.06);
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--white);
  color: var(--brick);
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: var(--shadow-soft);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(43, 23, 16, 0.55) 0%, rgba(43, 23, 16, 0) 55%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.card:hover .card-overlay {
  opacity: 1;
}

.overlay-cta {
  color: var(--white);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(4px);
  padding: 8px 16px;
  border-radius: 999px;
}

/* Cuerpo */
.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.eyebrow {
  font-family: var(--font-body);
  font-size: 10.5px;
  font-weight: 700;
  color: var(--coral);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

h3 {
  font-family: var(--font-body);
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.45;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 39px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 6px;
}

.price {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--brick);
}

.add-btn {
  background: var(--gradient);
  color: var(--white);
  padding: 9px 16px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.add-btn:hover {
  box-shadow: var(--shadow-hover);
}

.add-btn.added {
  background: var(--brick);
  transform: scale(1.05);
}

@media (max-width: 480px) {
  .card { width: 100%; }
}
</style>