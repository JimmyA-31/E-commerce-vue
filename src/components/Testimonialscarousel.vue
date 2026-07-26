<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  quote: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Camila Torres',
    role: 'Clienta desde 2023',
    avatar: 'https://i.pravatar.cc/100?img=47',
    quote: 'La calidad de la ropa superó mis expectativas y el envío llegó antes de lo esperado. Ya es mi tienda de cabecera.',
    rating: 5
  },
  {
    id: 2,
    name: 'Diego Ramírez',
    role: 'Comprador frecuente',
    avatar: 'https://i.pravatar.cc/100?img=12',
    quote: 'Compré unos accesorios tech y el proceso fue súper fácil. El soporte respondió mis dudas en minutos.',
    rating: 5
  },
  {
    id: 3,
    name: 'Valentina Ruiz',
    role: 'Clienta verificada',
    avatar: 'https://i.pravatar.cc/100?img=32',
    quote: 'Me encanta la variedad de categorías. Encontré desde ropa hasta gadgets en un mismo lugar, sin complicaciones.',
    rating: 4
  }
]

const current = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

// goTo() usa módulo, así que current.value siempre está en rango — el índice nunca es undefined
const activeTestimonial = computed<Testimonial>(
  () => testimonials[current.value]!
)

function goTo(index: number) {
  current.value = (index + testimonials.length) % testimonials.length
}
function next() {
  goTo(current.value + 1)
}

function startAutoplay() {
  timer = setInterval(next, 6000)
}
function stopAutoplay() {
  if (timer) clearInterval(timer)
}

onMounted(startAutoplay)
onUnmounted(stopAutoplay)
</script>

<template>
  <section class="testimonials" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
    <div class="section-header">
      <span class="ribbon">Lo que dicen de nosotros</span>
      <h2 class="font-display">Clientes que <span class="accent">confían</span> en nosotros</h2>
    </div>

    <div class="carousel-frame">
      <Transition name="fade-slide" mode="out-in">
        <div class="testimonial-card" :key="activeTestimonial.id">
          <div class="quote-mark">"</div>
          <p class="quote">{{ activeTestimonial.quote }}</p>
          <div class="stars">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= activeTestimonial.rating }"
            >★</span>
          </div>
          <div class="author">
            <img :src="activeTestimonial.avatar" :alt="activeTestimonial.name" />
            <div>
              <strong>{{ activeTestimonial.name }}</strong>
              <span>{{ activeTestimonial.role }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div class="dots">
      <button
        v-for="(t, i) in testimonials"
        :key="t.id"
        class="dot"
        :class="{ active: i === current }"
        @click="goTo(i)"
        :aria-label="`Ver testimonio ${i + 1}`"
      />
    </div>
  </section>
</template>

<style scoped>
.testimonials {
  padding: 72px 48px;
  background: var(--surface);
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
  color: var(--flame);
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

.carousel-frame {
  max-width: 640px;
  margin: 0 auto;
  min-height: 280px;
  display: flex;
  align-items: center;
}

.testimonial-card {
  width: 100%;
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 40px;
  box-shadow: var(--shadow-soft);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.quote-mark {
  font-family: var(--font-display);
  font-size: 48px;
  color: var(--peach);
  line-height: 1;
}

.quote {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink);
}

.stars {
  display: flex;
  gap: 3px;
}

.star {
  font-size: 15px;
  color: var(--peach);
}

.star.filled {
  color: var(--flame);
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}

.author img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--peach);
}

.author div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.author strong {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--ink);
}

.author span {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--ink-soft);
}

/* Dots */
.dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--peach);
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  padding: 0;
}

.dot.active {
  width: 26px;
  border-radius: 999px;
  background: var(--coral);
}

/* Transición */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

@media (max-width: 600px) {
  .testimonials { padding: 48px 20px; }
  .testimonial-card { padding: 28px 20px; }
}
</style>