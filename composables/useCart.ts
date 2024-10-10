type Item = { urlPrefix: unknown, discarded?: boolean, id: string }

export const useCart = <T extends Item>({ items: initialItems = [] }: { items?: T[] } = {}) => {
  const items = ref<T[]>(initialItems)

  const chain = usePrefix().urlPrefix
  const decimals = useChain().decimals
  const allItemsInChain = computed(() => items.value.filter(item => item.urlPrefix === chain.value))
  const itemsInChain = computed(() => allItemsInChain.value.filter(item => !item.discarded))
  const count = computed(() => itemsInChain.value.length)

  function getItem(id: string) {
    return items.value.find(item => item.id === id)
  }

  function existInItemIndex<T extends Item>(id: string, items: T[]) {
    return items.findIndex(item => item.id === id || item.token?.id === id)
  }

  function isItemInCart(id: string) {
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

  function updateItem(payload: Partial<T>) {
    const existingItemIndex = items.value.findIndex(item => item.id === payload.id)
    if (existingItemIndex !== -1) {
      items.value[existingItemIndex] = {
        ...items.value[existingItemIndex],
        ...payload,
      }
    }
  }

  function setItemDiscardedState({ id, discarded }: { id: string, discarded: boolean }) {
    const itemIndex = existInItemIndex(id, items.value)
    if (itemIndex !== -1) {
      items.value[itemIndex].discarded = discarded
      localStorage.value = items.value
    }
  }

  function removeItem(id: string) {
    const itemIndex = existInItemIndex<T>(id, items.value)
    if (itemIndex !== -1) {
      items.value.splice(itemIndex, 1)
      localStorage.value = items.value
    }
  }

  function clear() {
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
    clear,
    existInItemIndex,
    removeItem,
    updateItem,
    setItem,
    setItemDiscardedState,
  }
}
