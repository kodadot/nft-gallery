export default function ({
  ref,
  isFullscreen,
}: {
  ref: Ref<HTMLElement | null | undefined>
  isFullscreen: Ref<boolean>
}) {
  watch(isFullscreen, (fullscreen) => {
    if (fullscreen) {
      // make sure the iframe was focused when entering fullscreen mode
      ref.value?.getElementsByTagName('iframe')[0]?.focus()
    }
  })
}
