import { useQuery } from '@tanstack/vue-query'
import type { Prefix } from '@kodadot1/static'
import type { MaybeComputedRef } from '@vueuse/core'
import { fetchOdaCollectionAbi } from '@/services/oda'

export default (collectionId: Ref<string | undefined>, {
  prefix = usePrefix().urlPrefix,
  disabled = false,
}: { prefix?: Ref<Prefix>, disabled?: MaybeComputedRef<boolean> } = {}) => {
  const { data: abi } = useQuery({
    queryKey: ['collection-abi', collectionId],
    queryFn: () => isEvm(prefix.value) ? fetchOdaCollectionAbi(prefix.value, collectionId.value as string) : Promise.resolve(null),
    enabled: computed(() => Boolean(collectionId.value) && !unref(disabled)),
  })

  return abi
}
