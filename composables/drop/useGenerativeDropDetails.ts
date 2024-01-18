import { prefixToToken } from '@/components/common/shoppingCart/utils'
import { DropItem } from '@/params/types'

export default (drop: DropItem) => {
  const defaultImage = computed(() => drop?.image)
  const defaultName = computed(() => drop?.name)
  const defaultMax = computed(() => drop?.max || 255)
  const collectionId = computed(() => drop?.collection)
  const disabledByBackend = computed(() => drop?.disabled)
  const chainName = computed(() => getChainName(drop.chain))
  const token = computed(() => prefixToToken[drop.chain])
  const price = computed(() => drop?.price)
  const holderOfCollectionId = computed(() => drop?.holds)

  return {
    defaultMax,
    defaultName,
    defaultImage,
    collectionId,
    chainName,
    disabledByBackend,
    holderOfCollectionId,
    token,
    price,
  }
}
