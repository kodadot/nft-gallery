import { getDropDetails } from '@/components/drops/useDrops'

export const useUnlockableTag = (small: boolean) => {
  const { $i18n } = useNuxtApp()

  const drop = ref()

  const isMintedOut = computed(() => drop.value?.isMintedOut)
  const isFree = computed(() => drop.value?.isFree)

  const mintLiveText = computed(() => {
    const mintTypeKey = isFree.value
      ? 'mint.unlockable.freeMintLive'
      : 'mint.unlockable.mintLive'
    return $i18n.t(small ? `${mintTypeKey}Small` : mintTypeKey)
  })

  const mintStatusText = computed(() =>
    isMintedOut.value
      ? $i18n.t('mint.unlockable.mintedOut')
      : mintLiveText.value,
  )

  const actionText = computed(() =>
    $i18n.t(
      isMintedOut.value
        ? 'mint.unlockable.seeListings'
        : 'mint.unlockable.takeMe',
    ),
  )

  const to = computed(() =>
    isMintedOut.value
      ? `/${DEFAULT_DROP.chain}/explore/items?listed=true&collections=${DEFAULT_DROP.id}`
      : `/${DEFAULT_DROP.chain}/drops/${DEFAULT_DROP.alias}`,
  )

  onBeforeMount(async () => {
    drop.value = await getDropDetails(DEFAULT_DROP.alias)
  })

  return {
    to,
    actionText,
    mintStatusText,
  }
}
