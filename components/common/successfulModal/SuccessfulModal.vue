<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    @close="onClose">
    <ModalBody :title="$t('success')" @close="onClose">
      <TransactionSection :tx-hash="txHash" class="mb-5" />

      <slot />

      <hr class="!my-5" />

      <ShareSocialsSection
        :text="share.text"
        :url="share.url"
        :with-copy="share.withCopy" />

      <slot name="actions">
        <ActionButtons
          :primary="actionButtons.primary"
          :secondary="actionButtons.secondary"
          @primary="actionButtons.primary.onClick"
          @secondary="actionButtons.secondary.onClick" />
      </slot>
    </ModalBody>
  </NeoModal>
</template>
<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import TransactionSection from './TransactionSection.vue'
import { type ActionButton } from './ActionButtons.vue'

type ShareProp = { text: string; url: string; withCopy?: boolean }
type ActionButtonWithHandler = ActionButton & { onClick: () => void }

type ActionButtonsProp = {
  primary: ActionButtonWithHandler
  secondary: ActionButtonWithHandler
}

defineEmits(['modelValue'])
const props = defineProps<{
  modelValue: boolean
  txHash: string
  share: ShareProp
  actionButtons: ActionButtonsProp
}>()

const isModalActive = useVModel(props, 'modelValue')

const onClose = () => {
  isModalActive.value = false
}
</script>
