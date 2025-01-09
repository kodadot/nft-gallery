export function useOwnedCollections(id: Ref<string>) {
  return useAsyncData(`ownedCollections${id.value}`, () => getOwnedCollections(id.value))
}
