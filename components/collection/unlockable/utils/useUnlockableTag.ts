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

    let mintLive = isFree.value
      ? 'mint.unlockable.freeMintLive'
      : 'mint.unlockable.mintLive'

    if (small) {
      mintLive += 'Small'
    }

    return $i18n.t(mintLive)
  })

  const actionText = computed(() =>
    isMintedOut.value
      ? $i18n.t('mint.unlockable.seeListings')
      : $i18n.t('mint.unlockable.takeMe'),
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
