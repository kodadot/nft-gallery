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

      <ConfirmEmail
        v-else-if="isEmailConfirmStep && email"
        :email="email"
        :email-confirmed="emailConfirmed"
        :checking="checkingSubscription"
        @change="handleEmailChange"
        @check="handleEmailSubscriptionCheck" />

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
import ConfirmEmail from './ConfirmEmail.vue'
import { DropMintedNft } from '../Generative.vue'
import {
  getCountDownTime,
  useCountDown,
} from '@/components/collection/unlockable/utils/useCountDown'

enum ModalStep {
  EMAIL = 'email',
  CONFIRM_EMAIL = 'confirm_email',
  CLAIMING = 'claiming',
  SUCCEEDED = 'succeded',
}

const emit = defineEmits([
  'completed',
  'close',
  'list',
  'subscribe',
  'check-subscription',
])
const props = defineProps<{
  modelValue: boolean
  claiming: boolean
  subscriptionEmail?: string
  mintingSeconds: number
  mintedNft?: DropMintedNft
  canListNft: boolean
  checkingSubscription: boolean
  emailConfirmed?: boolean
}>()

const { displayDuration, distance, startCountDown } = useCountDown({
  immediate: false,
})

const { $i18n } = useNuxtApp()

const isModalActive = useVModel(props, 'modelValue')

const modalStep = ref<ModalStep>(ModalStep.EMAIL)
const email = ref<string>()
const changeEmail = ref(false)
const nftCoverLoaded = ref(false)
const retry = ref(3)

const sanitizedMintedNft = computed<DropMintedNft | undefined>(
  () =>
    props.mintedNft && {
      ...props.mintedNft,
      image: sanitizeIpfsUrl(props.mintedNft.image),
    },
)

const isEmailSignupStep = computed(() => modalStep.value === ModalStep.EMAIL)
const isEmailConfirmStep = computed(
  () => modalStep.value === ModalStep.CONFIRM_EMAIL,
)
const isClaimingDropStep = computed(
  () => modalStep.value === ModalStep.CLAIMING,
)
const isSuccessfulDropStep = computed(
  () => modalStep.value === ModalStep.SUCCEEDED,
)

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

  if (isEmailConfirmStep.value) {
    return $i18n.t('drops.confirmYourSubscription')
  }

  return $i18n.t('success')
})

const onClose = () => {
  emit('close')
}

const handleEmailChange = () => {
  email.value = undefined
  modalStep.value = ModalStep.EMAIL
  changeEmail.value = true
}

const handleEmailSignupConfirm = (value: string) => {
  email.value = value
  emit('subscribe', value)
}

const handleEmailSubscriptionCheck = () => {
  emit('check-subscription', email.value)
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
  const claiming = props.claiming
  const alreadyConfirmed = props.emailConfirmed && !email.value
  const alreadySubscribed =
    props.subscriptionEmail && !email.value && !changeEmail.value

  if (alreadyConfirmed && isEmailSignupStep.value) {
    modalStep.value = ModalStep.CLAIMING
  } else if (alreadySubscribed && isEmailSignupStep.value) {
    email.value = props.subscriptionEmail
    modalStep.value = ModalStep.CONFIRM_EMAIL
  } else if (email.value && isEmailSignupStep.value) {
    modalStep.value = ModalStep.CONFIRM_EMAIL
  } else if (claiming && isEmailConfirmStep.value) {
    modalStep.value = ModalStep.CLAIMING
  } else if (moveSuccessfulDrop.value && isClaimingDropStep.value) {
    modalStep.value = ModalStep.SUCCEEDED
  } else if (!props.modelValue && isSuccessfulDropStep.value) {
    modalStep.value = ModalStep.EMAIL
  }
})
</script>
