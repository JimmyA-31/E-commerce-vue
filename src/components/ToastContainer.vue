<script setup lang="ts">
import { useToast } from '../composables/usetoast'

const { toasts, remove } = useToast()

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠'
}
</script>

<template>
  <div class="toast-viewport">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
        @click="remove(toast.id)"
      >
        <span class="toast-icon">{{ icons[toast.type] }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-viewport {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  width: min(360px, calc(100vw - 32px));
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--ink);
  color: white;
  padding: 14px 16px;
  border-radius: 12px;
  box-shadow: var(--shadow-hover);
  font-family: var(--font-body);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  pointer-events: auto;
}

.toast-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.toast-message {
  line-height: 1.4;
}

.toast.success {
  background: var(--ink);
}
.toast.success .toast-icon {
  background: #43e97b;
  color: var(--ink);
}

.toast.error {
  background: var(--ink);
}
.toast.error .toast-icon {
  background: #ff5c5c;
  color: white;
}

.toast.info {
  background: var(--ink);
}
.toast.info .toast-icon {
  background: var(--peach);
  color: var(--ink);
}

.toast.warning {
  background: var(--ink);
}
.toast.warning .toast-icon {
  background: #ffcf5c;
  color: var(--ink);
}

/* Transiciones */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 480px) {
  .toast-viewport {
    bottom: 16px;
    width: calc(100vw - 24px);
  }
}
</style>