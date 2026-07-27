<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useUserStore } from '../stores/userStore'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { useOrderStore } from '../stores/orderStore'

const router = useRouter()
const cart = useCartStore()
const userStore = useUserStore()
const orderStore = useOrderStore()

onMounted(() => {
  if (userStore.isLoggedIn) {
    form.value.name = userStore.user?.name || ''
    form.value.email = userStore.user?.email || ''
  }
})

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

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zip: '',
  cardName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: ''
})

const shipping = computed(() => cart.total >= 50 ? 0 : 9.99)
const totalFinal = computed(() => (cart.total + shipping.value).toFixed(2))

function clearError(field: keyof typeof errors) {
  errors[field] = ''
}

// ---------- Validación por paso ----------
function validateStep1(): boolean {
  let valid = true

  if (!form.value.name.trim()) {
    errors.name = 'El nombre es obligatorio'
    valid = false
  } else if (form.value.name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres'
    valid = false
  } else {
    errors.name = ''
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email.trim()) {
    errors.email = 'El correo es obligatorio'
    valid = false
  } else if (!emailRegex.test(form.value.email)) {
    errors.email = 'Ingresa un correo válido'
    valid = false
  } else {
    errors.email = ''
  }

  const phoneDigits = form.value.phone.replace(/\D/g, '')
  if (!phoneDigits) {
    errors.phone = 'El teléfono es obligatorio'
    valid = false
  } else if (phoneDigits.length < 9) {
    errors.phone = 'El teléfono debe tener al menos 9 dígitos'
    valid = false
  } else {
    errors.phone = ''
  }

  return valid
}

function validateStep2(): boolean {
  let valid = true

  if (!form.value.address.trim()) {
    errors.address = 'La dirección es obligatoria'
    valid = false
  } else {
    errors.address = ''
  }

  if (!form.value.city.trim()) {
    errors.city = 'La ciudad es obligatoria'
    valid = false
  } else {
    errors.city = ''
  }

  if (!form.value.zip.trim()) {
    errors.zip = 'El código postal es obligatorio'
    valid = false
  } else if (!/^\d{4,6}$/.test(form.value.zip)) {
    errors.zip = 'Debe tener entre 4 y 6 dígitos numéricos'
    valid = false
  } else {
    errors.zip = ''
  }

  return valid
}

function validateStep3(): boolean {
  let valid = true

  if (!form.value.cardName.trim()) {
    errors.cardName = 'El nombre en la tarjeta es obligatorio'
    valid = false
  } else {
    errors.cardName = ''
  }

  const cardDigits = form.value.cardNumber.replace(/\s/g, '')
  if (!cardDigits) {
    errors.cardNumber = 'El número de tarjeta es obligatorio'
    valid = false
  } else if (cardDigits.length !== 16) {
    errors.cardNumber = 'Debe tener 16 dígitos'
    valid = false
  } else {
    errors.cardNumber = ''
  }

  if (!form.value.cardExpiry) {
    errors.cardExpiry = 'La fecha de vencimiento es obligatoria'
    valid = false
  } else {
    const match = form.value.cardExpiry.match(/^(\d{2})\/(\d{2})$/)
    if (!match) {
      errors.cardExpiry = 'Formato inválido (MM/YY)'
      valid = false
    } else {
      const [, monthStr, yearStr] = match
      const month = parseInt(monthStr ?? '', 10)
      const year = parseInt(yearStr ?? '', 10)
      const now = new Date()
      const currentYear = now.getFullYear() % 100
      const currentMonth = now.getMonth() + 1

      if (month < 1 || month > 12) {
        errors.cardExpiry = 'Mes inválido'
        valid = false
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.cardExpiry = 'La tarjeta está vencida'
        valid = false
      } else {
        errors.cardExpiry = ''
      }
    }
  }

  if (!form.value.cardCvv) {
    errors.cardCvv = 'El CVV es obligatorio'
    valid = false
  } else if (!/^\d{3}$/.test(form.value.cardCvv)) {
    errors.cardCvv = 'Debe tener 3 dígitos'
    valid = false
  } else {
    errors.cardCvv = ''
  }

  return valid
}

function nextStep() {
  const isValid = step.value === 1 ? validateStep1() : validateStep2()
  if (isValid && step.value < 3) step.value++
}

function prevStep() {
  if (step.value > 1) step.value--
}

// ---------- Formateo de inputs ----------
function formatPhone(e: Event) {
  const input = e.target as HTMLInputElement
  form.value.phone = input.value.replace(/\D/g, '').slice(0, 9)
  clearError('phone')
}

function formatZip(e: Event) {
  const input = e.target as HTMLInputElement
  form.value.zip = input.value.replace(/\D/g, '').slice(0, 6)
  clearError('zip')
}

function formatCard(e: Event) {
  const input = e.target as HTMLInputElement
  form.value.cardNumber = input.value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
  clearError('cardNumber')
}

function formatExpiry(e: Event) {
  const input = e.target as HTMLInputElement
  form.value.cardExpiry = input.value
    .replace(/\D/g, '')
    .slice(0, 4)
    .replace(/(.{2})/, '$1/')
  clearError('cardExpiry')
}

function formatCvv(e: Event) {
  const input = e.target as HTMLInputElement
  form.value.cardCvv = input.value.replace(/\D/g, '').slice(0, 3)
  clearError('cardCvv')
}

const isProcessing = ref(false)
const lastOrderId = ref('')

function placeOrder() {
  if (!validateStep3()) return

  isProcessing.value = true

  setTimeout(() => {
    const newOrder = orderStore.addOrder({
      items: cart.items,
      subtotal: cart.total,
      shipping: shipping.value,
      total: parseFloat(totalFinal.value),
      shippingInfo: {
        name: form.value.name,
        address: form.value.address,
        city: form.value.city,
        zip: form.value.zip,
        country: form.value.country
      }
    })

    lastOrderId.value = newOrder.id
    isProcessing.value = false
    orderPlaced.value = true
    cart.clearCart()
  }, 1800)
}
</script>

<template>
  <main class="checkout">

    <LoadingSpinner
    v-if="isProcessing"
    overlay
    message="Procesando tu pago de forma segura..."
    />

    <!-- Order placed -->
    <div v-if="orderPlaced" class="success">
      <div class="success-icon">🎉</div>
      <h1>¡Pedido confirmado!</h1>
      <p>Gracias por tu compra. Recibirás un correo con los detalles de tu pedido.</p>
      <div class="order-number">
        Pedido #{{ lastOrderId }}
      </div>
      <div class="success-actions">
        <button class="btn-primary" @click="router.push('/')">
          Seguir comprando →
        </button>
        <button class="btn-secondary" @click="router.push('/mis-pedidos')">
          Ver mis pedidos
        </button>
      </div>
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
                <input
                  v-model="form.name"
                  @input="clearError('name')"
                  type="text"
                  placeholder="Juan Pérez"
                  :class="{ 'input-error': errors.name }"
                />
                <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
              </div>
              <div class="form-group">
                <label>Correo electrónico</label>
                <input
                  v-model="form.email"
                  @input="clearError('email')"
                  type="email"
                  placeholder="juan@email.com"
                  :class="{ 'input-error': errors.email }"
                />
                <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input
                  :value="form.phone"
                  @input="formatPhone"
                  type="tel"
                  inputmode="numeric"
                  placeholder="999999999"
                  maxlength="9"
                  :class="{ 'input-error': errors.phone }"
                />
                <span v-if="errors.phone" class="error-msg">{{ errors.phone }}</span>
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
                <input
                  v-model="form.address"
                  @input="clearError('address')"
                  type="text"
                  placeholder="Av. Principal 123"
                  :class="{ 'input-error': errors.address }"
                />
                <span v-if="errors.address" class="error-msg">{{ errors.address }}</span>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Ciudad</label>
                  <input
                    v-model="form.city"
                    @input="clearError('city')"
                    type="text"
                    placeholder="Lima"
                    :class="{ 'input-error': errors.city }"
                  />
                  <span v-if="errors.city" class="error-msg">{{ errors.city }}</span>
                </div>
                <div class="form-group">
                  <label>Código postal</label>
                  <input
                    :value="form.zip"
                    @input="formatZip"
                    type="text"
                    inputmode="numeric"
                    placeholder="15001"
                    maxlength="6"
                    :class="{ 'input-error': errors.zip }"
                  />
                  <span v-if="errors.zip" class="error-msg">{{ errors.zip }}</span>
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
                <input
                  v-model="form.cardName"
                  @input="clearError('cardName')"
                  type="text"
                  placeholder="JUAN PÉREZ"
                  style="text-transform: uppercase"
                  :class="{ 'input-error': errors.cardName }"
                />
                <span v-if="errors.cardName" class="error-msg">{{ errors.cardName }}</span>
              </div>
              <div class="form-group">
                <label>Número de tarjeta</label>
                <input
                  :value="form.cardNumber"
                  @input="formatCard"
                  type="text"
                  inputmode="numeric"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  :class="{ 'input-error': errors.cardNumber }"
                />
                <span v-if="errors.cardNumber" class="error-msg">{{ errors.cardNumber }}</span>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Vencimiento</label>
                  <input
                    :value="form.cardExpiry"
                    @input="formatExpiry"
                    type="text"
                    inputmode="numeric"
                    placeholder="MM/YY"
                    maxlength="5"
                    :class="{ 'input-error': errors.cardExpiry }"
                  />
                  <span v-if="errors.cardExpiry" class="error-msg">{{ errors.cardExpiry }}</span>
                </div>
                <div class="form-group">
                  <label>CVV</label>
                  <input
                    :value="form.cardCvv"
                    @input="formatCvv"
                    type="password"
                    inputmode="numeric"
                    placeholder="•••"
                    maxlength="3"
                    :class="{ 'input-error': errors.cardCvv }"
                  />
                  <span v-if="errors.cardCvv" class="error-msg">{{ errors.cardCvv }}</span>
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

.input-error {
  border-color: #e8352a !important;
  background: #fff5f4 !important;
}

.error-msg {
  font-size: 12px;
  color: #e8352a;
  font-weight: 600;
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

.success-actions {
  display: flex;
  gap: 12px;
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

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Responsive */
@media (max-width: 900px) {
  .checkout {
    padding: 24px 16px;
  }

  .checkout-header h1 {
    font-size: 26px;
  }

  .checkout-body {
    grid-template-columns: 1fr;
  }

  .summary {
    position: static;
    order: -1;
  }

  .steps {
    gap: 20px;
  }

  .step-line {
    width: 70%;
  }

  .step-circle {
    width: 34px;
    height: 34px;
    font-size: 13px;
  }

  .step-label {
    font-size: 10.5px;
  }

  .form-card {
    padding: 22px 18px;
    border-radius: 16px;
    gap: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .btn-row {
    flex-direction: column-reverse;
  }

  .card-preview {
    padding: 18px;
    min-height: 120px;
  }

  .card-number-preview {
    font-size: 16px;
    letter-spacing: 1px;
  }

  .success-icon {
    font-size: 60px;
  }

  .success h1 {
    font-size: 26px;
  }
}
</style>