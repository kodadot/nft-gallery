import { getDropDetails } from '@/components/drops/useDrops'

export const useUnlockableTag = (small: boolean) => {
  const { $i18n } = useNuxtApp()

  const drop = ref()

  const isReady = computed(() => Boolean(drop.value))
  const isMintedOut = computed(() => drop.value?.isMintedOut)
  const isFree = computed(() => drop.value?.isFree)

  const mintStatusKey = computed(() => {
    if (isMintedOut.value) {
      return 'mint.unlockable.mintedOut'
    }

    return isFree.value
      ? 'mint.unlockable.freeMintLive'
      : 'mint.unlockable.mintLive'
  })

  const mintStatusText = computed(() =>
    $i18n.t(small ? `${mintStatusKey.value}Small` : mintStatusKey.value),
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
      ? `/${DEFAULT_DROP.chain}/collection/{DEFAULT_DROP.id}?listed=true`
      : `/${DEFAULT_DROP.chain}/drops/${DEFAULT_DROP.alias}`,
  )

  onBeforeMount(async () => {
    drop.value = await getDropDetails(DEFAULT_DROP.alias)
  })

  return {
    to,
    actionText,
    mintStatusText,
    isReady,
  }
}
