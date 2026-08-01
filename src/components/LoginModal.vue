<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

const {
  showLoginModal,
  isLoggingIn,
  loginForm,
  errors,
  clearError,
  closeLoginModal,
  submitLogin,
  loginAsDemo
} = useAuth()
</script>

<template>
  <div v-if="showLoginModal" class="modal-backdrop" @click.self="closeLoginModal">
    <div class="modal-card">
      <h3>Ingresar</h3>
      <p>Introduce tu nombre y correo para continuar (demo).</p>

      <div class="form-group">
        <label>Nombre</label>
        <input
          v-model="loginForm.name"
          @input="clearError('name')"
          type="text"
          placeholder="Tu nombre"
          :class="{ 'input-error': errors.name }"
        />
        <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label>Correo</label>
        <input
          v-model="loginForm.email"
          @input="clearError('email')"
          type="email"
          placeholder="correo@ejemplo.com"
          :class="{ 'input-error': errors.email }"
        />
        <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
      </div>

      <div class="btn-row">
        <button class="btn-secondary" @click="closeLoginModal" :disabled="isLoggingIn">
          Cancelar
        </button>
        <button class="btn-primary" @click="submitLogin" :disabled="isLoggingIn">
          {{ isLoggingIn ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </div>

      <div class="modal-divider">
        <span>o</span>
      </div>

      <button class="btn-demo" @click="loginAsDemo" :disabled="isLoggingIn">
        ⚡ Entrar con cuenta demo
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
  padding: 20px;
}

.modal-card {
  background: var(--white);
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  max-width: 380px;
  box-shadow: var(--shadow);
}

.modal-card h3 {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 22px;
}

.modal-card p {
  color: var(--gray);
  font-size: 13px;
  margin: 6px 0 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}

.form-group input {
  padding: 10px 12px;
  border: 2px solid var(--surface);
  border-radius: 10px;
  font-family: var(--font-body);
  outline: none;
}

.form-group input:focus {
  border-color: var(--coral);
}

.input-error {
  border-color: #e8352a !important;
  background: #fff5f4;
}

.error-msg {
  font-size: 12px;
  color: #e8352a;
  font-weight: 600;
}

.btn-row {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
}

.btn-primary {
  background: var(--gradient);
  color: white;
  padding: 10px 14px !important;
  border-radius: 12px;
}

.btn-secondary {
  background: transparent;
  color: var(--gray);
  border: 2px solid var(--surface);
  padding: 10px 14px !important;
  border-radius: 12px;
}

.btn-primary:disabled,
.btn-secondary:disabled,
.btn-demo:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.modal-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0 12px;
  color: var(--gray);
  font-size: 12px;
}

.modal-divider::before,
.modal-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--surface);
}

.btn-demo {
  width: 100%;
  background: var(--surface);
  color: var(--ink);
  border: 1.5px dashed var(--peach);
  padding: 12px !important;
  border-radius: 12px;
  font-weight: 700;
  font-size: 13.5px;
}

.btn-demo:hover {
  background: var(--peach);
  transform: none;
}
</style>