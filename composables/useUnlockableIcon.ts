export const useUnlockableIcon = () => {
  const { isDarkMode } = useTheme()
  const unlockableIcon = computed(() =>
    isDarkMode.value ? '/unlockable-dark.svg' : '/unlockable.svg',
  )

  return { unlockableIcon }
}
