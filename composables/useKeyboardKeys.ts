import { useMagicKeys } from '@vueuse/core'

export function useKeyboardKeys({ onPressControlEnter }) {
  const { Meta, Control, Enter } = useMagicKeys()

  watch([Meta, Control, Enter], () => {
    if (onPressControlEnter && (Meta.value || Control.value) && Enter.value) {
      onPressControlEnter()
    }
  })
}
