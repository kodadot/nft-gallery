export default function (target: Ref<HTMLHtmlElement | undefined>) {
  const targetIsVisible = ref(false)

  useIntersectionObserver(target, ([{ isIntersecting }]) => {
    // set visible only once
    if (!targetIsVisible.value && isIntersecting) {
      targetIsVisible.value = isIntersecting
    }
  })

  return targetIsVisible
}
