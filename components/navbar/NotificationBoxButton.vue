<template>
  <a class="navbar-item" @click="toggleNotificationModal">
    <span v-if="props.showLabel">{{ $t('notification.notifications') }}</span>
    <NeoIcon icon="bell" pack="far" class="icon" />
  </a>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { ModalProgrammatic as Modal } from 'buefy'
import { BModalConfig } from 'buefy/types/components'
import { NotificationBoxModalConfig } from '@/components/common/NotificationBox/useNotificationBox'
import { usePreferencesStore } from '@/stores/preferences'

const props = defineProps<{
  showLabel: boolean
}>()
const preferencesStore = usePreferencesStore()
const instance = getCurrentInstance()

function toggleNotificationModal() {
  if (!document.querySelector('.notification-box-modal')) {
    preferencesStore.setNotificationBoxCollapse(true)
    Modal.open({
      parent: instance?.proxy,
      onCancel: () => {
        preferencesStore.setNotificationBoxCollapse(false)
      },
      ...NotificationBoxModalConfig,
    } as unknown as BModalConfig)
  }

  // close all modal
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.__vue__?.$vnode?.context?.close()
    modal.remove()
  })
}
</script>
