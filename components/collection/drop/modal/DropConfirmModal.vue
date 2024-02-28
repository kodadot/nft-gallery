<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="isClaimingDropStep ? false : ['outside', 'escape']"
    scroll="clip"
    class="top"
    content-class="modal-width"
    @close="onClose">
    <ModalBody :title="title" @close="onClose">
      <EmailSignup
        v-if="isEmailSignupStep"
        :subscribing="subscribingToNewsletter"
        @confirm="handleEmailSignupConfirm" />

      <ConfirmEmail
        v-else-if="isEmailConfirmStep && email"
        :email="email"
        :email-confirmed="emailConfirmed"
        :checking="checkingSubscription"
        :resending="resendingConfirmationEmail"
        @change="handleEmailChange"
        @resend="handleConfirmationEmailResend"
        @check="handleEmailSubscriptionCheck" />

      <SigningModalBody
        v-else-if="isClaimingDropStep"
        :title="$t('drops.preparingYourNft')"
        :subtitle="est">
        <p class="py-5 capitalize">
          {{ $t('drops.stayTuned') }}
        </p>
      </SigningModalBody>

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
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import EmailSignup from './newsletter/EmailSignup.vue'
import ConfirmEmail from './newsletter/ConfirmEmail.vue'
import SuccessfulDrop from './shared/SuccessfulDrop.vue'
import { MINTING_SECONDS } from '../const'
import type { DropMintedNft } from '@/composables/drop/useGenerativeDropMint'
import {
  getCountDownTime,
  useCountDown,
} from '@/components/collection/unlockable/utils/useCountDown'
import { usePreloadMintedNftCover } from './utils'
import useGenerativeDropNewsletter from '@/composables/drop/useGenerativeDropNewsletter'

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
  'resend-confirmation-email',
])
const props = defineProps<{
  modelValue: boolean
  loading: boolean
  mintedNft?: DropMintedNft
  canListNft: boolean
}>()

const { displayDuration, distance, startCountDown } = useCountDown({
  immediate: false,
})

const preferencesStore = usePreferencesStore()
const { $i18n } = useNuxtApp()
const isModalActive = useVModel(props, 'modelValue')
const { retry, nftCoverLoaded, sanitizedMintedNft } = usePreloadMintedNftCover(
  computed(() => props.mintedNft),
)

const subscriptionEmail = preferencesStore.getNewsletterSubscription.email

const {
  checkingSubscription,
  subscribingToNewsletter,
  resendingConfirmationEmail,
  sendConfirmationEmailOnModalOpen,
  emailConfirmed,
} = useGenerativeDropNewsletter()

const modalStep = ref<ModalStep>(ModalStep.EMAIL)
const email = ref<string>()
const changeEmail = ref(false)
const resentInitialConfirmationEmail = ref(false)

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

const est = computed(() => `Est ~ ${displayDuration.value}`)

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

const handleConfirmationEmailResend = () => {
  emit('resend-confirmation-email')
}

const handleEmailSubscriptionCheck = () => {
  emit('check-subscription')
}

watch(
  () => props.loading,
  (claiming) => {
    if (claiming) {
      startCountDown(getCountDownTime(MINTING_SECONDS))
    }
  },
)

watchEffect(() => {
  const claiming = props.loading
  const alreadyConfirmed = emailConfirmed && !email.value
  const alreadySubscribed =
    subscriptionEmail && !email.value && !changeEmail.value

  if (alreadyConfirmed && isEmailSignupStep.value) {
    modalStep.value = ModalStep.CLAIMING
  } else if (alreadySubscribed && isEmailSignupStep.value) {
    email.value = subscriptionEmail
    modalStep.value = ModalStep.CONFIRM_EMAIL
  } else if (
    email.value &&
    isEmailSignupStep.value &&
    subscriptionEmail &&
    !subscribingToNewsletter
  ) {
    modalStep.value = ModalStep.CONFIRM_EMAIL
  } else if (claiming && isEmailConfirmStep.value) {
    modalStep.value = ModalStep.CLAIMING
  } else if (moveSuccessfulDrop.value && isClaimingDropStep.value) {
    modalStep.value = ModalStep.SUCCEEDED
  } else if (!props.modelValue && isSuccessfulDropStep.value) {
    modalStep.value = ModalStep.EMAIL
  }
})

watch(
  [() => props.modelValue, isEmailConfirmStep, modalStep],
  ([isModalOpen, emailConfirmStep]) => {
    if (
      isModalOpen &&
      emailConfirmStep &&
      !resentInitialConfirmationEmail.value &&
      sendConfirmationEmailOnModalOpen
    ) {
      handleConfirmationEmailResend()
      resentInitialConfirmationEmail.value = true
    }
  },
)
</script>
