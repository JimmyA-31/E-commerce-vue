<script setup lang="ts">
interface CategoryBanner {
  id: number
  name: string
  slug: string
  tag: string
  image: string
  size: 'large' | 'small'
}

const categories: CategoryBanner[] = [
  {
    id: 1,
    name: 'Ropa',
    slug: 'ropa',
    tag: 'Nueva temporada',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000&q=80',
    size: 'large'
  },
  {
    id: 2,
    name: 'Accesorios',
    slug: 'accesorios',
    tag: 'Detalles que importan',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
    size: 'small'
  },
  {
    id: 3,
    name: 'Tecnología',
    slug: 'tecnologia',
    tag: 'Innovación diaria',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    size: 'small'
  }
]

defineEmits<{ select: [slug: string] }>()
</script>

<template>
  <section class="categories">
    <div class="section-header">
      <span class="ribbon">Explora por categoría</span>
      <h2 class="font-display">Compra lo que <span class="accent">te apasiona</span></h2>
    </div>

    <div class="bento">
      <a
        v-for="cat in categories"
        :key="cat.id"
        href="#productos"
        class="banner"
        :class="cat.size"
        @click.prevent="$emit('select', cat.slug)"
      >
        <img :src="cat.image" :alt="cat.name" />
        <div class="banner-overlay"></div>
        <div class="banner-text">
          <span class="tag">{{ cat.tag }}</span>
          <h3 class="font-display">{{ cat.name }}</h3>
          <span class="link">Ver más →</span>
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
.categories {
  padding: 72px 48px 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.ribbon {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--flame);
}

.section-header h2 {
  font-size: 34px;
  font-weight: 600;
  color: var(--ink);
}

.accent {
  color: var(--brick);
  font-style: italic;
}

.bento {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  height: 480px;
}

.banner {
  position: relative;
  display: block;
  border-radius: var(--radius-lg);
  overflow: hidden;
  text-decoration: none;
}

.banner.large {
  grid-row: 1 / 3;
}

.banner.small {
  grid-row: span 1;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.banner:hover img {
  transform: scale(1.06);
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(43, 23, 16, 0.75) 0%, rgba(43, 23, 16, 0.05) 55%);
}

.banner-text {
  position: absolute;
  left: 28px;
  bottom: 26px;
  color: var(--white);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tag {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  opacity: 0.9;
}

.banner-text h3 {
  font-size: 28px;
  font-weight: 600;
}

.link {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  margin-top: 4px;
  opacity: 0.95;
}

@media (max-width: 768px) {
  .categories { padding: 48px 20px 12px; }
  .bento {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    height: auto;
  }
  .banner, .banner.large { height: 220px; grid-row: auto; }
}
</style>