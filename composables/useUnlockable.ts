import { EntityWithId } from '@/components/rmrk/service/scheme'
import { getValue } from '@/services/keywise'
import { Ref } from 'vue'

export function useUnlockable(entity: Ref<EntityWithId | undefined>) {
  const { urlPrefix } = usePrefix()
  const unlockLink = ref('')

  const fetchUnlockLink = async (value: string) => {
    if (value) {
      const url = await getValue(urlPrefix.value, value)
      unlockLink.value = url
    }
  }

  watch(
    () => entity.value?.id,
    (val) => {
      if (val) {
        fetchUnlockLink(val)
      }
    }
  )

  const isUnlockable = computed(() => {
    return unlockLink.value !== ''
  })

  return {
    isUnlockable,
    unlockLink,
  }
}
