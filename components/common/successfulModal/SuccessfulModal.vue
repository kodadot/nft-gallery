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
        <ActionButtons id="as" :can-list-nft="false" />
      </slot>
    </ModalBody>
  </NeoModal>
</template>
<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import TransactionSection from './TransactionSection.vue'

defineEmits(['modelValue'])
const props = defineProps<{
  modelValue: boolean
  txHash: string
  share: { text: string; url: string; withCopy?: boolean }
}>()

const isModalActive = useVModel(props, 'modelValue')

const onClose = () => {
  isModalActive.value = false
}
</script>
