<script setup lang="ts">
import Header from './components/Header.vue'
import CartSidebar from './components/CartSidebar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Header />
  <CartSidebar />
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <Footer />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>