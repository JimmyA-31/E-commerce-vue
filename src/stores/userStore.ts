import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface UserInfo {
  name: string
  email: string
}

const USER_KEY = 'vue-tienda-user'

function loadUser(): UserInfo | null {
  try {
    const raw = JSON.parse(localStorage.getItem(USER_KEY) ?? 'null')
    if (!raw) return null
    // Evitar que una cuenta demo persistente inicie sesión automáticamente
    if (raw.email && raw.email === 'demo@shopvue.local') return null
    return raw
  } catch {
    return null
  }
}

function saveUser(user: UserInfo | null) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo | null>(loadUser())
  const isLoggedIn = computed(() => user.value !== null)

  function loginDemo() {
    user.value = {
      name: 'JimmyDev',
      email: 'jimmy@gmail.com'
    }
    saveUser(user.value)
  }

  function login(name: string, email: string) {
    user.value = { name, email }
    saveUser(user.value)
  }

  function logout() {
    user.value = null
    saveUser(null)
  }

  return { user, isLoggedIn, loginDemo, login, logout }
})
