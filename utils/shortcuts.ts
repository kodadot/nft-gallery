import { useMagicKeys } from '@vueuse/core'

export function onPressControlEnter(callback: () => void) {
  const { Meta, Control, Enter } = useMagicKeys()

  return watch([Meta, Control, Enter], () => {
    if ((Meta.value || Control.value) && Enter.value) {
      callback()
    }
  })
}
