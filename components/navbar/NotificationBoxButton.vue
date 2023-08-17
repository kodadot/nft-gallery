<template>
  <a class="navbar-item" @click="toggleNotificationModal">
    <span v-if="props.showLabel">{{ $t('notification.notifications') }}</span>
    <NeoIcon icon="bell" pack="far" class="icon" />
  </a>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { NotificationBoxModalConfig } from '@/components/common/NotificationBox/useNotificationBox'
import { usePreferencesStore } from '@/stores/preferences'

const props = defineProps<{
  showLabel: boolean
}>()
const preferencesStore = usePreferencesStore()
const instance = getCurrentInstance()
const emit = defineEmits(['closeBurgerMenu'])
const isMobile = ref(window.innerWidth < 1024)

const { $neoModal } = useNuxtApp()

function toggleNotificationModal() {
  if (isMobile.value) {
    emit('closeBurgerMenu')
  }

  $neoModal.closeAll()

  if (!document.querySelector('.notification-box-modal')) {
    preferencesStore.setNotificationBoxCollapse(true)

    $neoModal.open({
      parent: instance?.proxy,
      onCancel: () => {
        preferencesStore.setNotificationBoxCollapse(false)
      },
      ...NotificationBoxModalConfig,
    })
  }
}
</script>
