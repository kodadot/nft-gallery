export default ({
  onChange,
  isOpen,
  and = [],
  onAnimationEnded = true,
  onClose = true,
}: {
  onChange: () => void
  isOpen: Ref<boolean>
  and?: Ref<boolean>[]
  onAnimationEnded?: boolean
  onClose?: boolean
}) => {
  watchDebounced(
    [isOpen, () => and],
    ([isOpen, and]) => {
      if (!isOpen === onClose && and.every(Boolean)) {
        onChange()
      }
    },
    { debounce: onAnimationEnded ? NEO_MODAL_ANIMATION_DURATION : 0 },
  )
}
