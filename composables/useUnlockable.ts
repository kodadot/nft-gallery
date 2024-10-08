import type { Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { EntityWithId } from '@/types'
import { getValue } from '@/services/keywise'

export function useUnlockable(
  entity: Ref<Pick<EntityWithId, 'id'> | undefined>,
) {
  const { urlPrefix } = usePrefix()
  const unlockLink = ref('')

  const fetchUnlockLink = async (id) => {
    const url = await getValue(urlPrefix.value, id)
    unlockLink.value = url
    return url ?? null
  }

  useQuery({
    queryKey: ['unlockable-link', urlPrefix, computed(() => entity.value?.id)],
    queryFn: () =>
      entity.value?.id ? fetchUnlockLink(entity.value?.id) : null,
    staleTime: 1000 * 60 * 5,
  })

  const isUnlockable = computed(() => Boolean(unlockLink.value))

  return {
    isUnlockable,
    unlockLink,
  }
}
