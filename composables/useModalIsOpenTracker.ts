import { debounce } from 'lodash'

export const NEO_MODAL_ANIMATION_DURATION = 200

export const onModalAnimation = onChange =>
  debounce(onChange, NEO_MODAL_ANIMATION_DURATION)()

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
    try {
      if (!isOpen === onClose && and.every(Boolean)) {
        ;(onClose ? onModalAnimation(onChange) : onChange)()
      }
    }
    catch (error) {
      console.log('[useModalIsOpenTracker] Error:', error)
    }
  })
}
