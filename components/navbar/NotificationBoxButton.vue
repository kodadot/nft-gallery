<template>
  <a class="navbar-item" @click="toggleNotificationModal">
    <span v-if="props.showLabel">{{ $t('notification.notifications') }}</span>
    <NeoIcon icon="bell" class="icon" size="medium" />
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

const { isMobile, isMobileWithoutTablet } = useBreakpoints()

const { neoModal } = useProgrammatic()

function toggleNotificationModal() {
  if (isMobile.value) {
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
        if (isMobile.value && type === ModalCloseType.BACK) {
          emit('closeBurgerMenu')
        }
      },
      ...NotificationBoxModalConfig,
      ...(isMobileWithoutTablet.value ? { animation: 'none' } : {}),
    })
  }
}
</script>
