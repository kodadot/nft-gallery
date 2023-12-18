import { getDropDetails } from '@/components/drops/useDrops'

const useUnlockableTagTexts = ({
  isMintedOut,
  isFree,
  small,
}: {
  isMintedOut: ComputedRef<boolean>
  isFree: ComputedRef<boolean>
  small: boolean
}) => {
  const { $i18n } = useNuxtApp()

  const mintStatusText = computed(() => {
    if (isMintedOut.value) {
      return $i18n.t('mint.unlockable.mintedOut')
    }
    const mintTypeKey = isFree.value
      ? 'mint.unlockable.freeMintLive'
      : 'mint.unlockable.mintLive'
    return $i18n.t(small ? `${mintTypeKey}Small` : mintTypeKey)
  })

  const actionText = computed(() =>
    $i18n.t(
      isMintedOut.value
        ? 'mint.unlockable.seeListings'
        : 'mint.unlockable.takeMe',
    ),
  )

  return {
    actionText,
    mintStatusText,
  }
}

export const useUnlockableTag = (small: boolean) => {
  const drop = ref()

  const isMintedOut = computed(() => drop.value?.isMintedOut)
  const isFree = computed(() => drop.value?.isFree)

  const { actionText, mintStatusText } = useUnlockableTagTexts({
    isFree,
    isMintedOut,
    small,
  })

  const to = computed(() =>
    isMintedOut.value
      ? `/${DEFAULT_DROP.chain}/explore/items?listed=true&collections=${DEFAULT_DROP.id}`
      : `/${DEFAULT_DROP.chain}/drops/${DEFAULT_DROP.alias}`,
  )

  onBeforeMount(async () => {
    drop.value = await getDropDetails({
      alias: DEFAULT_DROP.alias,
      collectionId: DEFAULT_DROP.id,
      chain: DEFAULT_DROP.chain,
    })
  })

  return {
    to,
    actionText,
    mintStatusText,
  }
}
