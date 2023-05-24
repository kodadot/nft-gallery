<template>
  <a class="navbar-item" @click.stop="toggleNotificationModal">
    <span v-if="props.showLabel">{{ $t('notification.notifications') }}</span>
    <NeoIcon ref="root" icon="bell" class="icon" />
  </a>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { ModalProgrammatic as Modal } from 'buefy'
import { BModalComponent, BModalConfig } from 'buefy/types/components'
import type Vue from 'vue'

import { NotificationBoxModalConfig } from '@/components/common/NotificationBox/useNotificationBox'
import { usePreferencesStore } from '@/stores/preferences'

const root = ref<Vue<Record<string, string>>>()
const props = defineProps<{
  showLabel: boolean
}>()
const emit = defineEmits(['closeBurgerMenu'])
const modal = ref<BModalComponent | null>()
const preferencesStore = usePreferencesStore()

function toggleNotificationModal() {
  emit('closeBurgerMenu')
  if (modal.value) {
    modal.value.close()
    modal.value = null
    preferencesStore.setNotificationBoxCollapse(false)
  } else {
    preferencesStore.setNotificationBoxCollapse(true)
    modal.value = Modal.open({
      parent: root?.value,
      onCancel: () => {
        modal.value = null
        preferencesStore.setNotificationBoxCollapse(false)
      },
      ...NotificationBoxModalConfig,
    } as unknown as BModalConfig)
  }
}
</script>
