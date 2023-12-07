<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    content-class="modal-width"
    @close="onClose">
    <ModalBody :title="title" @close="onClose">
      <transition name="fade">
        <EmailSignup v-if="needsEmail" @confirm="handleEmailSignupConfirm" />

        <ClaimingDrop v-else-if="claimingDrop" :est="displayDuration" />

        <SuccessfulDrop
          v-else-if="successfulDrop && mintedNft"
          :minted-nft="mintedNft"
          :can-list-nft="canListNft"
          @list="$emit('list')" />
      </transition>
    </ModalBody>
  </NeoModal>
</template>
<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import EmailSignup from './EmailSignup.vue'
import ClaimingDrop from './ClaimingDrop.vue'
import SuccessfulDrop from './SuccessfulDrop.vue'
import { DropMintedNft } from '../Generative.vue'
import { useCountDown } from '@/components/collection/unlockable/utils/useCountDown'

const emit = defineEmits(['confirm', 'completed', 'close', 'list'])
const props = defineProps<{
  modelValue: boolean
  claiming: boolean
  mintingSeconds: number
  mintedNft?: DropMintedNft
  canListNft: boolean
}>()

const {
  displayDuration,
  seconds,
  start: startCountDown,
} = useCountDown(new Date().getTime() + props.mintingSeconds * 1000, false)

const { $i18n } = useNuxtApp()

const isModalActive = useVModel(props, 'modelValue')

const email = ref<string>()

const successfulDrop = computed(() => !!props.mintedNft)
const claimingDrop = computed(() => props.claiming && seconds.value > 0)
const needsEmail = computed(
  () => !email.value && !claimingDrop.value && !successfulDrop.value,
)

const title = computed(() => {
  if (needsEmail.value) {
    return $i18n.t('drops.finalizeClaimNow')
  }

  if (claimingDrop.value) {
    return $i18n.t('drops.claimingDrop')
  }

  return $i18n.t('success')
})

const onClose = () => {
  emit('close')
}

const handleEmailSignupConfirm = (value: string) => {
  email.value = value
  confirm()
}

const confirm = () => {
  emit('confirm', { email: email.value })
  email.value = undefined
}

watch(
  () => props.claiming,
  (claiming) => {
    if (claiming) {
      startCountDown()
    }
  },
)
</script>
