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

  const mintStatusKey = computed(() => {
    if (isMintedOut.value) {
      return 'mint.unlockable.mintedOut'
    }

    const mintType = isFree.value ? 'freeMintLive' : 'mintLive'
    const sizeSuffix = small ? 'Small' : ''
    return `mint.unlockable.${mintType}${sizeSuffix}`
  })

  const actionTextKey = computed(() =>
    isMintedOut.value
      ? 'mint.unlockable.seeListings'
      : 'mint.unlockable.takeMe',
  )

  return {
    actionText: computed(() => $i18n.t(actionTextKey.value)),
    mintStatusText: computed(() => $i18n.t(mintStatusKey.value)),
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
