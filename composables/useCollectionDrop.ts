import { useQuery } from '@tanstack/vue-query'
import { getDrops } from '@/services/fxart'

export default function (collectionId: Ref<string>, urlPrefix = usePrefix().urlPrefix) {
  const { data, ...rest } = useQuery({
    queryKey: ['collection-drop', collectionId],
    queryFn: () =>
      collectionId.value
        ? getDrops({
          collection: collectionId.value,
          chain: [urlPrefix.value],
        })
        : null,
  })

  const drop = computed(() => data.value?.[0])

  return {
    drop,
    ...rest,
  }
}
