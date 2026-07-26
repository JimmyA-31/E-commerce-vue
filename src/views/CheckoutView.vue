<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'

const router = useRouter()
const cart = useCartStore()

const step = ref(1)
const orderPlaced = ref(false)

const form = ref({
  // Paso 1 - Personal
  name: '',
  email: '',
  phone: '',
  // Paso 2 - Envío
  address: '',
  city: '',
  zip: '',
  country: 'Perú',
  // Paso 3 - Pago
  cardName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: ''
})

const shipping = computed(() => cart.total >= 50 ? 0 : 9.99)
const totalFinal = computed(() => (cart.total + shipping.value).toFixed(2))

function nextStep() {
  if (step.value < 3) step.value++
}

function prevStep() {
  if (step.value > 1) step.value--
}

function formatCard(e: Event) {
  const input = e.target as HTMLInputElement
  form.value.cardNumber = input.value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function formatExpiry(e: Event) {
  const input = e.target as HTMLInputElement
  form.value.cardExpiry = input.value
    .replace(/\D/g, '')
    .slice(0, 4)
    .replace(/(.{2})/, '$1/')
}

function placeOrder() {
  orderPlaced.value = true
  cart.clearCart()
}
</script>

<template>
  <main class="checkout">

    <!-- Order placed -->
    <div v-if="orderPlaced" class="success">
      <div class="success-icon">🎉</div>
      <h1>¡Pedido confirmado!</h1>
      <p>Gracias por tu compra. Recibirás un correo con los detalles de tu pedido.</p>
      <div class="order-number">
        Pedido #{{ Math.floor(Math.random() * 900000) + 100000 }}
      </div>
      <button class="btn-primary" @click="router.push('/')">
        Seguir comprando →
      </button>
    </div>

    <template v-else>
      <div class="checkout-header">
        <h1>Finalizar <span class="gradient-text">compra</span></h1>
        <p>Completa tu pedido en 3 simples pasos</p>
      </div>

      <!-- Steps -->
      <div class="steps">
        <div
          v-for="n in 3"
          :key="n"
          class="step"
          :class="{ active: step === n, done: step > n }"
        >
          <div class="step-circle">
            <span v-if="step > n">✓</span>
            <span v-else>{{ n }}</span>
          </div>
          <span class="step-label">
            {{ n === 1 ? 'Personal' : n === 2 ? 'Envío' : 'Pago' }}
          </span>
        </div>
        <div class="step-line"></div>
      </div>

      <div class="checkout-body">

        <!-- Formulario -->
        <div class="form-section">

          <!-- Paso 1 - Datos personales -->
          <Transition name="fade" mode="out-in">
            <div v-if="step === 1" class="form-card" key="step1">
              <h2>👤 Datos personales</h2>
              <div class="form-group">
                <label>Nombre completo</label>
                <input v-model="form.name" type="text" placeholder="Juan Pérez" />
              </div>
              <div class="form-group">
                <label>Correo electrónico</label>
                <input v-model="form.email" type="email" placeholder="juan@email.com" />
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input v-model="form.phone" type="tel" placeholder="+51 999 999 999" />
              </div>
              <button class="btn-primary" @click="nextStep">
                Continuar → Envío
              </button>
            </div>

            <!-- Paso 2 - Envío -->
            <div v-else-if="step === 2" class="form-card" key="step2">
              <h2>🚚 Dirección de envío</h2>
              <div class="form-group">
                <label>Dirección</label>
                <input v-model="form.address" type="text" placeholder="Av. Principal 123" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Ciudad</label>
                  <input v-model="form.city" type="text" placeholder="Lima" />
                </div>
                <div class="form-group">
                  <label>Código postal</label>
                  <input v-model="form.zip" type="text" placeholder="15001" />
                </div>
              </div>
              <div class="form-group">
                <label>País</label>
                <select v-model="form.country">
                  <option>Perú</option>
                  <option>Colombia</option>
                  <option>México</option>
                  <option>Argentina</option>
                  <option>Chile</option>
                </select>
              </div>
              <div class="btn-row">
                <button class="btn-secondary" @click="prevStep">← Volver</button>
                <button class="btn-primary" @click="nextStep">Continuar → Pago</button>
              </div>
            </div>

            <!-- Paso 3 - Pago -->
            <div v-else class="form-card" key="step3">
              <h2>💳 Datos de pago</h2>
              <div class="card-preview">
                <div class="card-chip">💳</div>
                <div class="card-number-preview">
                  {{ form.cardNumber || '•••• •••• •••• ••••' }}
                </div>
                <div class="card-bottom">
                  <span>{{ form.cardName || 'NOMBRE APELLIDO' }}</span>
                  <span>{{ form.cardExpiry || 'MM/YY' }}</span>
                </div>
              </div>
              <div class="form-group">
                <label>Nombre en la tarjeta</label>
                <input v-model="form.cardName" type="text" placeholder="JUAN PÉREZ" style="text-transform: uppercase" />
              </div>
              <div class="form-group">
                <label>Número de tarjeta</label>
                <input
                  :value="form.cardNumber"
                  @input="formatCard"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Vencimiento</label>
                  <input
                    :value="form.cardExpiry"
                    @input="formatExpiry"
                    type="text"
                    placeholder="MM/YY"
                    maxlength="5"
                  />
                </div>
                <div class="form-group">
                  <label>CVV</label>
                  <input v-model="form.cardCvv" type="password" placeholder="•••" maxlength="3" />
                </div>
              </div>
              <div class="btn-row">
                <button class="btn-secondary" @click="prevStep">← Volver</button>
                <button class="btn-primary btn-order" @click="placeOrder">
                  🔒 Confirmar pedido
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Resumen -->
        <div class="summary">
          <h2>Resumen del pedido</h2>
          <div class="summary-items">
            <div v-for="item in cart.items" :key="item.id" class="summary-item">
              <img :src="item.image" :alt="item.title" />
              <div class="summary-item-info">
                <p>{{ item.title }}</p>
                <span>x{{ item.quantity }}</span>
              </div>
              <strong>${{ (item.price * item.quantity).toFixed(2) }}</strong>
            </div>
          </div>

          <div class="summary-totals">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${{ cart.total.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Envío</span>
              <span class="free" v-if="shipping === 0">Gratis 🎉</span>
              <span v-else>${{ shipping }}</span>
            </div>
            <div class="divider"></div>
            <div class="summary-row total">
              <span>Total</span>
              <span>${{ totalFinal }}</span>
            </div>
          </div>
        </div>

      </div>
    </template>
  </main>
</template>

<style scoped>
.checkout {
  padding: 48px;
  max-width: 1100px;
  margin: 0 auto;
}

.checkout-header {
  text-align: center;
  margin-bottom: 40px;
}

.checkout-header h1 {
  font-size: 36px;
  font-weight: 800;
}

.checkout-header p {
  color: var(--gray);
  margin-top: 8px;
}

.gradient-text {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Steps */
.steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  margin-bottom: 48px;
  position: relative;
}

.step-line {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: #eee;
  z-index: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

.step-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  transition: all 0.3s;
  color: var(--gray);
}

.step.active .step-circle {
  background: var(--gradient);
  color: white;
  box-shadow: var(--shadow);
}

.step.done .step-circle {
  background: var(--gradient-green);
  color: white;
}

.step-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--gray);
}

.step.active .step-label {
  color: var(--primary);
}

/* Body */
.checkout-body {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
  align-items: start;
}

/* Form */
.form-card {
  background: white;
  border-radius: 24px;
  padding: 36px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-card h2 {
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 2px solid #eee;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
  background: var(--bg);
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--primary);
  background: white;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.btn-row {
  display: flex;
  gap: 12px;
}

.btn-primary {
  background: var(--gradient);
  color: white;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  box-shadow: var(--shadow);
  flex: 1;
}

.btn-primary:hover {
  box-shadow: var(--shadow-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--gray);
  border: 2px solid #eee;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 14px;
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: none;
}

/* Card preview */
.card-preview {
  background: var(--gradient);
  border-radius: 16px;
  padding: 24px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 140px;
  box-shadow: var(--shadow);
}

.card-chip {
  font-size: 28px;
}

.card-number-preview {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  opacity: 0.9;
  text-transform: uppercase;
}

/* Summary */
.summary {
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 100px;
}

.summary h2 {
  font-size: 18px;
  font-weight: 800;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 280px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-item img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  background: var(--bg);
  border-radius: 10px;
  padding: 4px;
}

.summary-item-info {
  flex: 1;
}

.summary-item-info p {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.summary-item-info span {
  font-size: 11px;
  color: var(--gray);
}

.summary-item strong {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary);
  white-space: nowrap;
}

.summary-totals {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--gray);
}

.summary-row.total {
  font-size: 18px;
  font-weight: 800;
  color: var(--text);
}

.free {
  color: #43e97b;
  font-weight: 700;
}

.divider {
  height: 1px;
  background: #f0f0f0;
}

/* Success */
.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
  text-align: center;
}

.success-icon {
  font-size: 80px;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-16px); }
}

.success h1 {
  font-size: 36px;
  font-weight: 900;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.success p {
  color: var(--gray);
  max-width: 400px;
  line-height: 1.7;
}

.order-number {
  background: var(--bg);
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 700;
  color: var(--primary);
  font-size: 18px;
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>