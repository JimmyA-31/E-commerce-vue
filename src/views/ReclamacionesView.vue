<script setup lang="ts">
import { ref } from 'vue'

const submitted = ref(false)

const form = ref({
  // Datos personales
  name: '',
  email: '',
  phone: '',
  dni: '',
  // Tipo
  tipo: 'reclamo',
  // Pedido
  orderNumber: '',
  // Detalle
  product: '',
  description: '',
  solution: ''
})

function submitForm() {
  submitted.value = true
}
</script>

<template>
  <main class="reclamaciones">

    <!-- Success -->
    <div v-if="submitted" class="success">
      <div class="success-icon">✅</div>
      <h1>¡Reclamación enviada!</h1>
      <p>Hemos recibido tu reclamación correctamente. Nos comunicaremos contigo en un plazo máximo de <strong>15 días hábiles</strong>.</p>
      <div class="ticket">
        <span>N° de caso</span>
        <strong>#RC-{{ Math.floor(Math.random() * 900000) + 100000 }}</strong>
      </div>
      <button class="btn-primary" @click="submitted = false">
        Nueva reclamación
      </button>
    </div>

    <template v-else>
      <div class="page-header">
        <div class="header-badge">📋 Libro de Reclamaciones</div>
        <h1>Libro de <span class="gradient-text">Reclamaciones</span></h1>
        <p>De conformidad con el Código de Protección y Defensa del Consumidor, contamos con un Libro de Reclamaciones a tu disposición.</p>
      </div>

      <div class="content">

        <!-- Info legal -->
        <div class="legal-banner">
          <span class="legal-icon">⚖️</span>
          <div>
            <strong>Ley N° 29571</strong>
            <p>Código de Protección y Defensa del Consumidor. La hoja de reclamación será atendida en un plazo no mayor a 15 días hábiles.</p>
          </div>
        </div>

        <!-- Formulario -->
        <div class="form-card">

          <!-- Tipo de solicitud -->
          <div class="tipo-section">
            <h2>Tipo de solicitud</h2>
            <div class="tipo-options">
              <div
                class="tipo-option"
                :class="{ active: form.tipo === 'queja' }"
                @click="form.tipo = 'queja'"
              >
                <span class="tipo-icon">😤</span>
                <strong>Queja</strong>
                <p>Malestar o descontento respecto a la atención</p>
              </div>
              <div
                class="tipo-option"
                :class="{ active: form.tipo === 'reclamo' }"
                @click="form.tipo = 'reclamo'"
              >
                <span class="tipo-icon">📢</span>
                <strong>Reclamo</strong>
                <p>Disconformidad relacionada con los productos o servicios</p>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Datos personales -->
          <div class="section">
            <h2>👤 Datos del consumidor</h2>
            <div class="form-row">
              <div class="form-group">
                <label>Nombre completo *</label>
                <input v-model="form.name" type="text" placeholder="Juan Pérez" />
              </div>
              <div class="form-group">
                <label>DNI / RUC *</label>
                <input v-model="form.dni" type="text" placeholder="12345678" maxlength="11" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Correo electrónico *</label>
                <input v-model="form.email" type="email" placeholder="juan@email.com" />
              </div>
              <div class="form-group">
                <label>Teléfono *</label>
                <input v-model="form.phone" type="tel" placeholder="+51 999 999 999" />
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Detalle del pedido -->
          <div class="section">
            <h2>🛒 Detalle del pedido</h2>
            <div class="form-row">
              <div class="form-group">
                <label>N° de pedido</label>
                <input v-model="form.orderNumber" type="text" placeholder="#123456" />
              </div>
              <div class="form-group">
                <label>Producto reclamado</label>
                <input v-model="form.product" type="text" placeholder="Nombre del producto" />
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Descripción -->
          <div class="section">
            <h2>📝 Detalle de la reclamación</h2>
            <div class="form-group">
              <label>Descripción del problema *</label>
              <textarea
                v-model="form.description"
                placeholder="Describe detalladamente tu problema..."
                rows="4"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Solución esperada</label>
              <textarea
                v-model="form.solution"
                placeholder="¿Qué solución esperas de nuestra parte?"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div class="legal-note">
            <span>🔒</span>
            <p>Al enviar este formulario, confirmas que los datos proporcionados son verídicos. ShopVue se compromete a dar respuesta en un plazo máximo de 15 días hábiles.</p>
          </div>

          <button class="btn-primary" @click="submitForm">
            📋 Enviar reclamación
          </button>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
.reclamaciones {
  padding: 48px;
  max-width: 900px;
  margin: 0 auto;
}

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.header-badge {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  color: #856404;
  padding: 8px 20px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  width: fit-content;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 900;
}

.gradient-text {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-header p {
  color: var(--gray);
  max-width: 600px;
  line-height: 1.7;
  font-size: 15px;
}

/* Legal banner */
.legal-banner {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: linear-gradient(135deg, #f0eeff, #fff0f3);
  border: 1px solid rgba(108,99,255,0.2);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
}

.legal-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.legal-banner strong {
  display: block;
  color: var(--primary);
  font-size: 15px;
  margin-bottom: 4px;
}

.legal-banner p {
  font-size: 13px;
  color: var(--gray);
  line-height: 1.6;
}

/* Form */
.form-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section h2,
.tipo-section h2 {
  font-size: 17px;
  font-weight: 800;
  color: var(--text);
}

/* Tipo */
.tipo-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tipo-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.tipo-option {
  border: 2px solid #eee;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tipo-option:hover {
  border-color: var(--primary);
}

.tipo-option.active {
  border-color: var(--primary);
  background: linear-gradient(135deg, #f0eeff, #fff0f3);
}

.tipo-icon {
  font-size: 28px;
}

.tipo-option strong {
  font-size: 15px;
  color: var(--text);
}

.tipo-option p {
  font-size: 12px;
  color: var(--gray);
  line-height: 1.4;
}

/* Form groups */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #eee;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
  background: var(--bg);
  font-family: inherit;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--primary);
  background: white;
}

/* Legal note */
.legal-note {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: var(--bg);
  padding: 16px;
  border-radius: 12px;
  font-size: 12px;
  color: var(--gray);
  line-height: 1.6;
}

/* Button */
.btn-primary {
  background: var(--gradient);
  color: white;
  padding: 16px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  box-shadow: var(--shadow-hover);
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
  max-width: 440px;
  line-height: 1.7;
}

.ticket {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: var(--bg);
  padding: 16px 40px;
  border-radius: 16px;
  border: 2px dashed var(--primary);
}

.ticket span {
  font-size: 12px;
  color: var(--gray);
}

.ticket strong {
  font-size: 24px;
  color: var(--primary);
  font-weight: 900;
}

@media (max-width: 640px) {
  .reclamaciones {
    padding: 24px 16px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .page-header p {
    font-size: 14px;
  }

  .legal-banner {
    flex-direction: column;
    padding: 16px;
    gap: 10px;
  }

  .form-card {
    padding: 24px 18px;
    gap: 20px;
    border-radius: 16px;
  }

  .tipo-options {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .ticket {
    padding: 14px 20px;
    width: 100%;
  }

  .success h1 {
    font-size: 26px;
  }

  .success p {
    font-size: 14px;
  }
}
</style>