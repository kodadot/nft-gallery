import { prefixToToken } from '@/components/common/shoppingCart/utils'
import { useDrop } from '@/components/drops/useDrops'

export default () => {
  const drop = useDrop()
  const defaultImage = computed(() => drop.value?.image)
  const defaultName = computed(() => drop.value?.name ?? '')
  const defaultMax = computed(() => drop.value?.max || 255)
  const collectionId = computed(() => drop.value?.collection ?? '')
  const disabledByBackend = computed(() => drop.value?.disabled)
  const chainName = computed(() => getChainName(drop.value?.chain ?? 'ahp'))
  const token = computed(() => prefixToToken[drop.value?.chain ?? 'ahp'])
  const price = computed(() => drop.value?.price)
  const holderOfCollectionId = computed(() => drop.value?.holder_of)

  return {
    defaultMax,
    defaultName,
    defaultImage,
    collectionId,
    chainName,
    disabledByBackend,
    token,
    price,
    holderOfCollectionId,
  }
}
