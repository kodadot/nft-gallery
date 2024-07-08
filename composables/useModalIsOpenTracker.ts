import { debounce } from 'lodash'

export const NEO_MODAL_ANIMATION_DURATION = 200

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
  watch([isOpen, () => and], ([isOpen, and]) => {
    if (!isOpen === onClose && and.every(Boolean)) {
      ;(onClose ? debounce(onChange, NEO_MODAL_ANIMATION_DURATION) : onChange)()
    }
  })
}
