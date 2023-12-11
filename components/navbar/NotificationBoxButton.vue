<template>
  <a class="navbar-item" @click="toggleNotificationModal">
    <span class="notification-label">
      {{ $t('notification.notifications') }}
    </span>
    <NeoIcon icon="bell" class="icon notification-icon" size="medium" />
  </a>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { NotificationBoxModalConfig } from '@/components/common/NotificationBox/useNotificationBox'
import { usePreferencesStore } from '@/stores/preferences'
import { ModalCloseType } from './types'

const preferencesStore = usePreferencesStore()
const emit = defineEmits(['closeBurgerMenu'])
const isMobile = ref(window.innerWidth < 1024)
const isMobileWithoutTablet = ref(window.innerWidth < 768)

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

<style scoped lang="scss">
.notification-label {
  display: block;

  @media (min-width: 1024px) {
    display: none;
  }
}

.notification-icon {
  margin-left: 0.5rem !important;

  @media (min-width: 1024px) {
    margin-left: 0 !important;
  }
}
</style>
