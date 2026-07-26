<template>
  <div class="practica">
    <h1>Practica</h1>
    <p>Esta es la página de práctica.</p>
    <h4>{{ contador }}</h4>
    <button @click="incrementar">{{ contador < 20 ? "incrementar" : "Limite Alcanzado" }}</button>
    <input type="password" placeholder="contraseña" v-model="contraseña">
    <p>Seguridad: {{ seguridad }}</p>
    <h3></h3>
  </div>
</template>

<script setup lang="ts">
import { ref, watch} from 'vue'

const contador = ref(0)
const contraseña = ref('')
const seguridad = ref('Baja')

watch(contraseña, (newValue => {
  if(newValue.length < 6) {
    seguridad.value = 'Baja'
  } else if (newValue.match(/[A-Z]/) && newValue.match(/[0-9]/)) {
    seguridad.value = 'Alta'
  } else {
    seguridad.value = 'Media'
  }
}))
function incrementar() {
  contador.value = contador.value < 20 ? contador.value + 1 : 0
}
</script>