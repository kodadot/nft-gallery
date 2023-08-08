<template>
  <a class="navbar-item" @click="toggleNotificationModal">
    <span v-if="props.showLabel">{{ $t('notification.notifications') }}</span>
    <NeoIcon icon="bell" pack="far" class="icon" />
  </a>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { useProgrammatic } from '@oruga-ui/oruga-next'
import { NotificationBoxModalConfig } from '@/components/common/NotificationBox/useNotificationBox'
import { usePreferencesStore } from '@/stores/preferences'

const { oruga } = useProgrammatic()
const props = defineProps<{
  showLabel: boolean
}>()
const emit = defineEmits(['closeBurgerMenu'])
const modal = ref(null)
const preferencesStore = usePreferencesStore()

function toggleNotificationModal() {
  emit('closeBurgerMenu')

  if (!document.querySelector('.notification-box-modal')) {
    preferencesStore.setNotificationBoxCollapse(true)
    modal.value = oruga.modal.open({
      onCancel: () => {
        modal.value = null
        preferencesStore.setNotificationBoxCollapse(false)
      },
      ...NotificationBoxModalConfig,
    })
  }

  // close all modal
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.__vue__?.$vnode?.context?.close()
    modal.remove()
  })
}
</script>
