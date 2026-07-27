<script setup lang="ts">
withDefaults(defineProps<{
  overlay?: boolean
  message?: string
}>(), {
  overlay: false,
  message: 'Cargando...'
})
</script>

<template>
  <div :class="['loading-wrapper', { overlay }]">
    <div class="sunset-spinner">
      <span class="ring ring-1"></span>
      <span class="ring ring-2"></span>
      <span class="ring ring-3"></span>
      <span class="core"></span>
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<style scoped>
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
}

.loading-wrapper.overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 246, 239, 0.88);
  backdrop-filter: blur(6px);
  z-index: 999;
}

.sunset-spinner {
  position: relative;
  width: 64px;
  height: 64px;
}

.ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
}

.ring-1 {
  border-top-color: var(--coral);
  border-right-color: var(--coral);
  animation: spin 1s linear infinite;
}

.ring-2 {
  inset: 9px;
  border-top-color: var(--flame);
  animation: spin 1.4s linear infinite reverse;
}

.ring-3 {
  inset: 18px;
  border-top-color: var(--peach);
  animation: spin 0.8s linear infinite;
}

.core {
  position: absolute;
  inset: 26px;
  border-radius: 50%;
  background: var(--gradient-sunset);
  animation: pulse 1.2s ease-in-out infinite;
}

.loading-message {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: 0.01em;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(0.85); opacity: 0.85; }
  50% { transform: scale(1.1); opacity: 1; }
}
</style>