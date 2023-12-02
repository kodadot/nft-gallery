export default function (customBreakpoint?: number) {
  const { width } = useWindowSize()

  const isMobile = ref()
  const isMobileWithoutTablet = ref()
  const isTinyMobile = ref()
  const isFullHD = ref()
  const isLessThanCustomBreakpoint = ref()
  const isGreaterThanCustomBreakpoint = ref()

  watchPostEffect(() => {
    isMobile.value = width.value < 1024
    isMobileWithoutTablet.value = width.value < 768
    isTinyMobile.value = width.value < 480
    isFullHD.value = width.value >= 1440

    if (!customBreakpoint) {
      return
    }

    isLessThanCustomBreakpoint.value = width.value < customBreakpoint
    isGreaterThanCustomBreakpoint.value = width.value >= customBreakpoint
  })

  return {
    isMobile,
    isMobileWithoutTablet,
    isTinyMobile,
    isFullHD,
    isLessThanCustomBreakpoint,
    isGreaterThanCustomBreakpoint,
  }
}
