<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const subscribed = ref(false)

function subscribe() {
  if (!email.value) return
  subscribed.value = true
  email.value = ''
  setTimeout(() => (subscribed.value = false), 3000)
}
</script>

<template>
  <section class="newsletter-banner">
    <div class="blob"></div>
    <div class="content">
      <span class="ribbon">Únete a la comunidad</span>
      <h2 class="font-display">Recibe ofertas antes que nadie</h2>
      <p>Suscríbete y obtén 10% de descuento en tu primera compra.</p>

      <form class="form" @submit.prevent="subscribe">
        <input
          v-model="email"
          type="email"
          placeholder="tu@email.com"
          required
        />
        <button type="submit">{{ subscribed ? '✓ ¡Listo!' : 'Suscribirme' }}</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.newsletter-banner {
  position: relative;
  margin: 24px 48px 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--gradient);
  padding: 56px 32px;
  display: flex;
  justify-content: center;
}

.blob {
  position: absolute;
  top: -60px;
  right: -40px;
  width: 260px;
  height: 260px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
}

.content {
  position: relative;
  text-align: center;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--white);
}

.ribbon {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.content h2 {
  font-size: 30px;
  font-weight: 600;
}

.content p {
  font-family: var(--font-body);
  font-size: 14.5px;
  opacity: 0.9;
}

.form {
  display: flex;
  gap: 0;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
  max-width: 380px;
}

.form input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 13px 18px;
  color: var(--white);
  font-family: var(--font-body);
  font-size: 13.5px;
}

.form input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.form button {
  background: var(--white);
  color: var(--brick);
  border: none;
  padding: 0 22px;
  font-family: var(--font-body);
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .newsletter-banner { margin: 24px 20px 0; padding: 40px 20px; }
  .form { flex-direction: column; border-radius: 16px; }
  .form button { padding: 12px; }
}
</style>