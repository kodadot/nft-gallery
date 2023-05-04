import unloackableDark from '@/assets/unlockable-dark.svg'
import unloackable from '@/assets/unlockable.svg'

export const useUnlockableIcon = () => {
  const { isDarkMode } = useTheme()
  const unlockableIcon = computed(() =>
    isDarkMode.value ? unloackableDark : unloackable
  )

  return { unlockableIcon }
}
