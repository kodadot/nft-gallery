<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    content-class="modal-width"
    @close="onClose">
    <ModalBody :title="title" @close="onClose">
      <EmailSignup
        v-if="isEmailSignupStep"
        @confirm="handleEmailSignupConfirm" />

      <ClaimingDrop v-else-if="isClaimingDropStep" :est="displayDuration" />

      <SuccessfulDrop
        v-else-if="isSuccessfulDropStep"
        :minted-nft="sanitizedMintedNft"
        :can-list-nft="canListNft"
        @list="$emit('list')" />
    </ModalBody>
  </NeoModal>
</template>
<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import { preloadImage } from '@/utils/dom'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import EmailSignup from './EmailSignup.vue'
import ClaimingDrop from './ClaimingDrop.vue'
import SuccessfulDrop from './SuccessfulDrop.vue'
import { DropMintedNft } from '../Generative.vue'
import {
  getCountDownTime,
  useCountDown,
} from '@/components/collection/unlockable/utils/useCountDown'

enum ModalStep {
  EMAIL = 'email',
  CLAIMING = 'claiming',
  SUCCEEDED = 'succeded',
}

const emit = defineEmits(['confirm', 'completed', 'close', 'list'])
const props = defineProps<{
  modelValue: boolean
  claiming: boolean
  mintingSeconds: number
  mintedNft?: DropMintedNft
  canListNft: boolean
}>()

const { displayDuration, distance, startCountDown } = useCountDown({
  immediate: false,
})

const { $i18n } = useNuxtApp()

const isModalActive = useVModel(props, 'modelValue')

const modalStep = ref<ModalStep>(ModalStep.EMAIL)
const email = ref<string>()
const nftCoverLoaded = ref(false)
const retry = ref(3)

const sanitizedMintedNft = computed<DropMintedNft | undefined>(
  () =>
    props.mintedNft && {
      ...props.mintedNft,
      image: sanitizeIpfsUrl(props.mintedNft.image),
    },
)

const isEmailSignupStep = computed(() => modalStep.value === 'email')
const isClaimingDropStep = computed(() => modalStep.value === 'claiming')
const isSuccessfulDropStep = computed(() => modalStep.value === 'succeded')

const moveSuccessfulDrop = computed(() => {
  if (nftCoverLoaded.value) {
    return true
  }

  return distance.value <= 0 && sanitizedMintedNft.value && retry.value === 0
})

const title = computed(() => {
  if (isEmailSignupStep.value) {
    return $i18n.t('drops.finalizeClaimNow')
  }

  if (isClaimingDropStep.value) {
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
      startCountDown(getCountDownTime(props.mintingSeconds))
    }
  },
)

watch([sanitizedMintedNft, retry], async ([mintedNft]) => {
  if (mintedNft?.image && retry.value) {
    try {
      nftCoverLoaded.value = await preloadImage(mintedNft.image)
    } catch (error) {
      retry.value -= 1
    }
  }
})

watchEffect(() => {
  if (props.claiming && isEmailSignupStep.value) {
    modalStep.value = ModalStep.CLAIMING
  } else if (moveSuccessfulDrop.value && isClaimingDropStep.value) {
    modalStep.value = ModalStep.SUCCEEDED
  } else if (!props.modelValue && isSuccessfulDropStep.value) {
    modalStep.value = ModalStep.EMAIL
  }
})
</script>
