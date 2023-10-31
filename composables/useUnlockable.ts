import { EntityWithId } from '@/components/rmrk/service/scheme'
import { getValue } from '@/services/keywise'
import { Ref } from 'vue'

export function useUnlockable(
  entity: Ref<Pick<EntityWithId, 'id'> | undefined>,
) {
  const { urlPrefix } = usePrefix()
  const unlockLink = ref('')

  const fetchUnlockLink = async () => {
    const id = entity.value?.id
    if (id) {
      const url = await getValue(urlPrefix.value, id)
      unlockLink.value = url
    }
  }

  onMounted(() => {
    fetchUnlockLink()
  })

  watch(
    () => entity.value?.id,
    () => {
      fetchUnlockLink()
    },
  )

  const isUnlockable = computed(() => Boolean(unlockLink.value))

  return {
    isUnlockable,
    unlockLink,
  }
}
