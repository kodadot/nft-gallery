<template>
  <NeoIcon
    ref="root"
    icon="bell"
    class="navbar-item"
    @click.native="toggleNotificationModal" />
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { NotificationBoxModalConfig } from '@/components/common/NotificationBox/useNotificationBox'
import { BModalComponent, BModalConfig } from 'buefy/types/components'
import type Vue from 'vue'
import { ModalProgrammatic as Modal } from 'buefy'

const { $store, $buefy, $nextTick } = useNuxtApp()
const root = ref<Vue<Record<string, string>>>()

const emit = defineEmits(['closeBurgerMenu'])
const modal = ref<BModalComponent | null>()

function toggleNotificationModal() {
  emit('closeBurgerMenu')
  if (modal.value) {
    modal.value.close()
    modal.value = null
  } else {
    modal.value = Modal.open({
      parent: root?.value,
      ...NotificationBoxModalConfig,
    } as any as BModalConfig)
  }
}
</script>

<style scoped></style>
