import { reactive } from 'vue'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

interface ConfirmState extends Required<ConfirmOptions> {
  visible: boolean
  resolve: ((value: boolean) => void) | null
}

const state = reactive<ConfirmState>({
  visible: false,
  title: '¿Estás seguro?',
  message: '',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  danger: false,
  resolve: null
})

function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  state.visible = true
  state.title = options.title ?? '¿Estás seguro?'
  state.message = options.message
  state.confirmText = options.confirmText ?? 'Confirmar'
  state.cancelText = options.cancelText ?? 'Cancelar'
  state.danger = options.danger ?? false

  return new Promise(resolve => {
    state.resolve = resolve
  })
}

function handleConfirm() {
  state.visible = false
  state.resolve?.(true)
  state.resolve = null
}

function handleCancel() {
  state.visible = false
  state.resolve?.(false)
  state.resolve = null
}

export function useConfirm() {
  return { state, confirmDialog, handleConfirm, handleCancel }
}