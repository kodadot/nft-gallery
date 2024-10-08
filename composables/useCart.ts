type ID = string

type Item = { urlPrefix: unknown, discarded?: boolean, id: string }

export const useCart = <T extends Item>({ items: initialItems = [] }: { items: T[] }) => {
  const items = ref<T[]>(initialItems)
  const chain = ref(usePrefix().urlPrefix)
  const decimals = ref(useChain().decimals)

  const allItemsInChain = computed(() => items.value.filter(item => item.urlPrefix === chain.value))
  const itemsInChain = computed(() => allItemsInChain.value.filter(item => !item.discarded))
  const count = computed(() => itemsInChain.value.length)

  function getItem(id: ID) {
    return items.value.find(item => item.id === id)
  }

  function existInItemIndex<T extends Item>(id: string, items: T[]) {
    return items.findIndex(item => item.id === id || item.token?.id === id)
  }

  function isItemInCart(id: ID) {
    return existInItemIndex<T>(id, items.value) !== -1
  }

  function clearDiscardedItems() {
    items.value = items.value.filter(item => !item.discarded)
  }

  function setItem(payload: T) {
    const itemIndex = existInItemIndex<T>(payload.id, items.value)
    if (itemIndex === -1) {
      items.value.push(payload)
      localStorage.value = items.value
    }
  }

  function setItemDiscardedState({ id, discarded }: { id: ID, discarded: boolean }) {
    const itemIndex = existInItemIndex(id, items.value)
    if (itemIndex !== -1) {
      items.value[itemIndex].discarded = discarded
      localStorage.value = items.value
    }
  }

  function removeItem(id: ID) {
    const itemIndex = existInItemIndex<T>(id, items.value)
    if (itemIndex !== -1) {
      items.value.splice(itemIndex, 1)
      localStorage.value = items.value
    }
  }

  function clearItems() {
    items.value = []
  }

  return {
    items,
    chain,
    decimals,
    count,
    allItemsInChain,
    itemsInChain,
    getItem,
    isItemInCart,
    clearDiscardedItems,
    clearItems,
    existInItemIndex,
    removeItem,
    setItem,
    setItemDiscardedState,
  }
}
