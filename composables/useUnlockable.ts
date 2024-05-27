import { EntityWithId } from '@/components/rmrk/service/scheme'
import { getValue } from '@/services/keywise'
import { Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
export function useUnlockable(
  entity: Ref<Pick<EntityWithId, 'id'> | undefined>,
) {
  const { urlPrefix } = usePrefix()
  const unlockLink = ref('')

  const fetchUnlockLink = async (id) => {
    const url = await getValue(urlPrefix.value, id)
    unlockLink.value = url
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
