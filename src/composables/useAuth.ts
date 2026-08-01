import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useToast } from './useToast'

// Estado global (fuera del composable) para que el modal se pueda
// abrir desde cualquier componente, no solo desde el Header
const showLoginModal = ref(false)
const isLoggingIn = ref(false)

const loginForm = reactive({ name: '', email: '' })
const errors = reactive({ name: '', email: '' })

export function useAuth() {
  const userStore = useUserStore()
  const toast = useToast()
  const route = useRoute()
  const router = useRouter()

  function clearError(field: keyof typeof errors) {
    errors[field] = ''
  }

  function openLoginModal() {
    loginForm.name = ''
    loginForm.email = ''
    errors.name = ''
    errors.email = ''
    showLoginModal.value = true
  }

  function closeLoginModal() {
    showLoginModal.value = false
  }

  function validateLogin(): boolean {
    let valid = true

    const name = loginForm.name.trim()
    if (!name) {
      errors.name = 'El nombre es obligatorio'
      valid = false
    } else if (name.length < 3) {
      errors.name = 'Mínimo 3 caracteres'
      valid = false
    } else {
      errors.name = ''
    }

    const email = loginForm.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      errors.email = 'El correo es obligatorio'
      valid = false
    } else if (!emailRegex.test(email)) {
      errors.email = 'Ingresa un correo válido'
      valid = false
    } else {
      errors.email = ''
    }

    return valid
  }

  // Lógica compartida al finalizar login (manual o demo)
  function completeLogin(name: string) {
    showLoginModal.value = false
    isLoggingIn.value = false
    toast.success(`¡Bienvenido, ${name}! 👋`)

    // Si venía de una ruta protegida (checkout, mis-pedidos, etc.), lo regresa ahí
    const redirect = route.query.redirect as string | undefined
    if (redirect) {
      router.push(redirect)
    }
  }

  function submitLogin() {
    if (!validateLogin()) return

    isLoggingIn.value = true

    // Simula una breve verificación, como si consultara un backend
    setTimeout(() => {
      userStore.login(loginForm.name.trim(), loginForm.email.trim())
      completeLogin(loginForm.name.trim())
    }, 700)
  }

  function loginAsDemo() {
    isLoggingIn.value = true

    setTimeout(() => {
      userStore.loginDemo()
      completeLogin(userStore.user?.name ?? 'invitado')
    }, 500)
  }

  function logout() {
    userStore.logout()
    toast.info('Sesión cerrada')
  }

  return {
    // estado
    showLoginModal,
    isLoggingIn,
    loginForm,
    errors,
    // acciones
    clearError,
    openLoginModal,
    closeLoginModal,
    submitLogin,
    loginAsDemo,
    logout
  }
}