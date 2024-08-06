import debounce from 'lodash/debounce'
import delay from 'lodash/delay'

export const NEO_MODAL_ANIMATION_DURATION = 200

export const onModalAnimation = onChange => delay(onChange, NEO_MODAL_ANIMATION_DURATION)

export default ({
  onChange,
  isOpen,
  and = [],
  onClose = true,
}: {
  onChange: () => void
  isOpen: Ref<boolean>
  and?: Ref<boolean>[]
  onClose?: boolean
}) => {
  const debouncedFn = debounce(onChange, NEO_MODAL_ANIMATION_DURATION)
  watch([isOpen, () => and], ([isOpen, and]) => {
    if (!isOpen === onClose && and.every(Boolean)) {
      ;(onClose ? debouncedFn : onChange)()
    }
  })
}
