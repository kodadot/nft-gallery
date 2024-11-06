import type { NFTWithMetadata } from '@/composables/useNft'

export const ATOMIC_SWAP_PAGES = [
  'prefix-swap-id',
  'prefix-swap-id-offer',
  'prefix-swap-id-review',
]

export default (nft: NFTWithMetadata) => {
  const route = useRoute()
  const { desired, offered } = storeToRefs(useAtomicSwapsStore())

  const routeName = computed(() => route.name?.toString() as string)

  const showAtomicSwapAction = computed(() => ATOMIC_SWAP_PAGES.includes(routeName.value))

  const isDesiredSelection = computed(() => routeName.value === 'prefix-swap-id')
  const isOfferedSelection = computed(() => routeName.value === 'prefix-swap-id-offer')

  const items = computed(() => {
    if (isDesiredSelection.value) {
      return desired
    }
    if (isOfferedSelection.value) {
      return offered
    }
    return ref([])
  })

  const isItemSelected = computed(() => items.value.value.some(item => item.id === nft.id))

  const onAtomicSwapSelect = () => {
    if (isItemSelected.value) {
      items.value.value = items.value.value.filter(item => item.id !== nft.id)
    }
    else {
      items.value.value.push(nft)
    }
  }

  return {
    onAtomicSwapSelect,
    showAtomicSwapAction,
    isItemSelected,
  }
}
