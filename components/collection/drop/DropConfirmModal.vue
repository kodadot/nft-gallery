<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    content-class="modal-width"
    @close="onClose">
    <ModalBody :title="$t('drops.finalizeClaimNow')" @close="onClose">
      <div>
        <ModalIdentityItem />
      </div>

      <p class="py-5 is-capitalized">
        {{ $t('drops.subscribe') }}
      </p>

      <form @submit.prevent="confirm">
        <NeoInput
          ref="emailInput"
          v-model="email"
          type="email"
          required
          :placeholder="$t('mint.nft.email.placeholder')" />

        <div class="is-flex is-justify-content-space-between pt-5">
          <NeoButton
            class="is-flex is-flex-1 btn-height is-capitalized"
            :disabled="disabled"
            no-shadow
            variant="k-accent"
            native-type="submit">
            {{ submitButtonText }}
          </NeoButton>
        </div>
      </form>
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoInput, NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'

const emit = defineEmits(['confirm', 'completed', 'close'])
const { $i18n } = useNuxtApp()
const props = defineProps<{ modelValue: boolean }>()

const isModalActive = useVModel(props, 'modelValue')

const emailInput = ref()
const email = ref()

const disabled = computed(() => {
  return !emailInput.value?.checkHtml5Validity() && email.value !== ''
})

const submitButtonText = computed(() => {
  if (!email.value) {
    return $i18n.t('drops.enterValidEmail')
  }
  return $i18n.t('drops.subscribeAndClaim')
})

const onClose = () => {
  emit('close')
}

const confirm = () => {
  emit('confirm', { email: email.value })
  email.value = ''
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.modal-width {
  width: 25rem;
}

.btn-height {
  height: 3.5rem;
}
</style>
