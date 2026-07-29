import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

// Estado global (fuera del composable) para que todos los componentes compartan la misma lista
const toasts = reactive<ToastItem[]>([])
let nextId = 0

function push(message: string, type: ToastType = 'info', duration = 3200) {
  const id = nextId++
  toasts.push({ id, message, type })
  setTimeout(() => remove(id), duration)
}

function remove(id: number) {
  const index = toasts.findIndex(t => t.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

export function useToast() {
  return {
    toasts,
    success: (message: string, duration?: number) => push(message, 'success', duration),
    error: (message: string, duration?: number) => push(message, 'error', duration),
    info: (message: string, duration?: number) => push(message, 'info', duration),
    warning: (message: string, duration?: number) => push(message, 'warning', duration),
    remove
  }
}