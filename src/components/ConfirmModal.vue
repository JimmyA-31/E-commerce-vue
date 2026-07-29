<script setup lang="ts">
import { useConfirm } from '../composables/useConfirm'

const { state, handleConfirm, handleCancel } = useConfirm()
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="state.visible" class="confirm-backdrop" @click.self="handleCancel">
      <div class="confirm-card">
        <h3>{{ state.title }}</h3>
        <p>{{ state.message }}</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="handleCancel">
            {{ state.cancelText }}
          </button>
          <button
            class="btn-confirm"
            :class="{ danger: state.danger }"
            @click="handleConfirm"
          >
            {{ state.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(43, 23, 16, 0.45);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.confirm-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  width: 100%;
  max-width: 380px;
  box-shadow: var(--shadow-hover);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.confirm-card h3 {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--ink);
}

.confirm-card p {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.6;
  margin-bottom: 8px;
}

.confirm-actions {
  display: flex;
  gap: 10px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 13.5px;
  font-weight: 700;
}

.btn-cancel {
  background: var(--surface);
  color: var(--ink);
}

.btn-cancel:hover {
  background: var(--peach);
  transform: none;
}

.btn-confirm {
  background: var(--gradient);
  color: white;
  box-shadow: var(--shadow);
}

.btn-confirm.danger {
  background: #e8352a;
}

.btn-confirm:hover {
  box-shadow: var(--shadow-hover);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>