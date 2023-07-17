<template>
  <a class="navbar-item" @click="toggleNotificationModal">
    <span v-if="props.showLabel">{{ $t('notification.notifications') }}</span>
    <NeoIcon icon="bell" pack="far" class="icon" />
  </a>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { ModalProgrammatic as Modal } from 'buefy'
import { BModalComponent, BModalConfig } from 'buefy/types/components'
import { NotificationBoxModalConfig } from '@/components/common/NotificationBox/useNotificationBox'
import { usePreferencesStore } from '@/stores/preferences'

const props = defineProps<{
  showLabel: boolean
}>()
const emit = defineEmits(['closeBurgerMenu'])
const modal = ref<BModalComponent | null>()
const preferencesStore = usePreferencesStore()
const instance = getCurrentInstance()

function toggleNotificationModal() {
  emit('closeBurgerMenu')

  if (!document.querySelector('.notification-box-modal')) {
    preferencesStore.setNotificationBoxCollapse(true)
    modal.value = Modal.open({
      parent: instance?.proxy,
      onCancel: () => {
        modal.value = null
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
