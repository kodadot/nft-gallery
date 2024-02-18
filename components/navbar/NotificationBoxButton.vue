<template>
  <a class="navbar-item" @click="toggleNotificationModal">
    <span v-if="props.showLabel">{{ $t('notification.notifications') }}</span>
    <NeoIcon icon="bell" class="w-4 h-4" size="medium" />
  </a>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { NotificationBoxModalConfig } from '@/components/common/NotificationBox/useNotificationBox'
import { usePreferencesStore } from '@/stores/preferences'
import { ModalCloseType } from './types'

const props = defineProps<{
  showLabel: boolean
}>()

const preferencesStore = usePreferencesStore()
const emit = defineEmits(['closeBurgerMenu'])
const { isMobile, isMobileOrTablet } = useDevice()

const { neoModal } = useProgrammatic()

function toggleNotificationModal() {
  if (isMobileOrTablet) {
    emit('closeBurgerMenu')
  }

  neoModal.closeAll()

  if (!document.querySelector('.notification-box-modal')) {
    preferencesStore.setNotificationBoxCollapse(true)

    neoModal.open({
      onCancel: () => {
        preferencesStore.setNotificationBoxCollapse(false)
      },
      onClose: (type: ModalCloseType) => {
        if (isMobileOrTablet && type === ModalCloseType.BACK) {
          emit('closeBurgerMenu')
        }
      },
      ...NotificationBoxModalConfig,
      ...(isMobile ? { animation: 'none' } : {}),
    })
  }
}
</script>
