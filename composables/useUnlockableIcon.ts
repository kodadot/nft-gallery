export const useUnlockableIcon = () => {
  const colorMode = useColorMode()
  const unlockableIcon = computed(() =>
    colorMode.preference === 'dark'
      ? '/unlockable-dark.svg'
      : '/unlockable.svg',
  )

  return { unlockableIcon }
}
