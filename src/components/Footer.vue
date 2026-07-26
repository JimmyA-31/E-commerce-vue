<template>
  <footer class="footer">
    <div class="footer-glow"></div>

    <!-- Top -->
    <div class="footer-top">
      <div class="brand">
        <div class="logo">
          <span>⚡</span>
          <span class="logo-text font-display">ShopVue</span>
        </div>
        <p>Tu tienda favorita con los mejores productos al mejor precio. Envío rápido y seguro.</p>
        <div class="socials">
          <a href="#" class="social" aria-label="Facebook">📘</a>
          <a href="#" class="social" aria-label="Instagram">📸</a>
          <a href="#" class="social" aria-label="Twitter">🐦</a>
          <a href="#" class="social" aria-label="YouTube">▶️</a>
        </div>
      </div>

      <div class="links-group">
        <h4>Tienda</h4>
        <a href="#">Productos</a>
        <a href="#">Categorías</a>
        <a href="#">Ofertas</a>
        <a href="#">Novedades</a>
      </div>

      <div class="links-group">
        <h4>Ayuda</h4>
        <a href="#">Preguntas frecuentes</a>
        <a href="#">Envíos</a>
        <a href="#">Devoluciones</a>
        <a href="#">Contacto</a>
        <RouterLink to="/reclamaciones">Libro de Reclamaciones</RouterLink>
      </div>

      <div class="links-group newsletter-group">
        <h4>Newsletter</h4>
        <p class="newsletter-text">Suscríbete y recibe ofertas exclusivas</p>
        <form class="newsletter" @submit.prevent>
          <input type="email" placeholder="tu@email.com" />
          <button type="submit" aria-label="Suscribirse">→</button>
        </form>
        <div class="payment-methods">
          <span>💳</span>
          <span>🏦</span>
          <span>📱</span>
          <span>💰</span>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="divider"></div>

    <!-- Bottom -->
    <div class="footer-bottom">
      <p>Jimmy Dev © 2026 ShopVue. Todos los derechos reservados.</p>
      <div class="bottom-links">
        <a href="#">Privacidad</a>
        <a href="#">Términos</a>
        <a href="#">Cookies</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background: linear-gradient(160deg, var(--ink) 0%, var(--brick) 130%);
  color: var(--white);
  padding: 64px 48px 28px;
  margin-top: 80px;
  overflow: hidden;
}

/* Resplandor decorativo sutil, en tono de la paleta */
.footer-glow {
  position: absolute;
  top: -120px;
  right: -80px;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(255, 131, 96, 0.22) 0%, transparent 70%);
  pointer-events: none;
}

/* Top */
.footer-top {
  position: relative;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.6fr;
  gap: 48px;
  margin-bottom: 48px;
}

/* Brand */
.brand {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
}

.logo span:first-child {
  font-size: 26px;
}

.logo-text {
  font-size: 23px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--peach), var(--coral));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand p {
  font-family: var(--font-body);
  font-size: 14px;
  color: rgba(255, 232, 214, 0.65);
  line-height: 1.7;
  max-width: 260px;
}

.socials {
  display: flex;
  gap: 12px;
}

.social {
  width: 40px;
  height: 40px;
  background: rgba(255, 232, 214, 0.08);
  border: 1px solid rgba(255, 232, 214, 0.12);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.social:hover {
  background: var(--gradient);
  border-color: transparent;
  transform: translateY(-4px);
}

/* Links */
.links-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.links-group h4 {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--peach);
  margin-bottom: 4px;
}

.links-group a {
  font-family: var(--font-body);
  font-size: 14px;
  color: rgba(255, 232, 214, 0.65);
  text-decoration: none;
  transition: color 0.2s;
  width: fit-content;
}

.links-group a:hover {
  color: var(--white);
}

/* Newsletter */
.newsletter-group {
  gap: 14px;
}

.newsletter-text {
  font-family: var(--font-body);
  font-size: 13px;
  color: rgba(255, 232, 214, 0.65);
  line-height: 1.5;
}

.newsletter {
  display: flex;
  gap: 0;
  background: rgba(255, 232, 214, 0.08);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(255, 232, 214, 0.18);
}

.newsletter input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 12px 18px;
  color: var(--white);
  font-family: var(--font-body);
  font-size: 13px;
}

.newsletter input::placeholder {
  color: rgba(255, 232, 214, 0.4);
}

.newsletter button {
  background: var(--gradient);
  color: var(--white);
  padding: 0 20px;
  font-size: 17px;
  border-radius: 0;
  flex-shrink: 0;
}

.newsletter button:hover {
  transform: none;
  opacity: 0.9;
}

.payment-methods {
  display: flex;
  gap: 10px;
  font-size: 20px;
  margin-top: 2px;
  opacity: 0.85;
}

/* Divider */
.divider {
  position: relative;
  height: 1px;
  background: rgba(255, 232, 214, 0.12);
  margin-bottom: 28px;
}

/* Bottom */
.footer-bottom {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-bottom p {
  font-family: var(--font-body);
  font-size: 13px;
  color: rgba(255, 232, 214, 0.5);
}

.bottom-links {
  display: flex;
  gap: 24px;
}

.bottom-links a {
  font-family: var(--font-body);
  font-size: 13px;
  color: rgba(255, 232, 214, 0.5);
  text-decoration: none;
  transition: color 0.2s;
}

.bottom-links a:hover {
  color: var(--white);
}

@media (max-width: 1024px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
    row-gap: 40px;
  }
}

@media (max-width: 600px) {
  .footer { padding: 48px 24px 24px; }
  .footer-top { grid-template-columns: 1fr; gap: 36px; }
  .footer-bottom { flex-direction: column; align-items: flex-start; }
}
</style>