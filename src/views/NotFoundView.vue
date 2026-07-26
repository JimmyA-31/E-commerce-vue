<template>
  <main class="not-found">
    <span class="code font-display">404</span>
    <h1 class="font-display">Esta página no existe</h1>
    <p>Puede que el enlace esté roto o la página se haya movido.</p>
    <RouterLink to="/" class="btn-primary">Volver al inicio</RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  padding: 48px 24px;
  background: var(--cream, var(--bg));
}

.code {
  font-size: 96px;
  font-weight: 600;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.not-found h1 {
  font-size: 26px;
  font-weight: 600;
  color: var(--text);
}

.not-found p {
  font-family: var(--font-body);
  color: var(--gray);
  font-size: 15px;
  max-width: 360px;
}

.btn-primary {
  margin-top: 12px;
  background: var(--gradient);
  color: white;
  padding: 12px 28px;
  border-radius: 999px;
  text-decoration: none;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 14px;
  box-shadow: var(--shadow);
}
</style>