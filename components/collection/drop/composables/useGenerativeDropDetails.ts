import { prefixToToken } from '@/components/common/shoppingCart/utils'

export default (drop) => {
  const defaultImage = computed(() => drop?.image)
  const defaultName = computed(() => drop?.name)
  const defaultMax = computed(() => drop?.max || 255)
  const collectionId = computed(() => drop?.collection)
  const disabledByBackend = computed(() => drop?.disabled)
  const chainName = computed(() => getChainName(drop.chain))
  const token = computed(() => prefixToToken[drop.chain])

  return {
    defaultMax,
    defaultName,
    defaultImage,
    collectionId,
    chainName,
    disabledByBackend,
    token,
  }
}
