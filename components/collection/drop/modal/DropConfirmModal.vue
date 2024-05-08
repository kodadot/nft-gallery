<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="isClaimingDropStep ? false : ['outside', 'escape']"
    class="top"
    content-class="!w-[unset]"
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
        :subtitle="$t('mint.progress')"
        :custom-formatted-estimation="est">
        <p class="py-5 capitalize">
          {{ $t('drops.stayTuned') }}
        </p>
      </SigningModalBody>

      <SuccessfulDrop
        v-else-if="isSuccessfulDropStep"
        :minting-session="mintingSession"
        :can-list-nfts="canListMintedNft"
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
import {
  getCountDownTime,
  useCountDown,
} from '@/components/collection/unlockable/utils/useCountDown'
import { usePreloadImages } from './utils'
import useGenerativeDropNewsletter from '@/composables/drop/useGenerativeDropNewsletter'
import useGenerativeDropMint from '@/composables/drop/useGenerativeDropMint'
import { useDropStore } from '@/stores/drop'
import { MintedNFT, MintingSession } from '../types'

enum ModalStep {
  EMAIL = 'email',
  CONFIRM_EMAIL = 'confirm_email',
  CLAIMING = 'claiming',
  SUCCEEDED = 'succeded',
}

const emit = defineEmits(['completed', 'close', 'list'])
const props = defineProps<{
  modelValue: boolean
}>()

const { displayDuration, distance, startCountDown } = useCountDown({
  immediate: false,
})

const dropStore = useDropStore()

const preferencesStore = usePreferencesStore()
const { $i18n } = useNuxtApp()
const isModalActive = useVModel(props, 'modelValue')

const {
  checkingSubscription,
  subscribingToNewsletter,
  resendingConfirmationEmail,
  sendConfirmationEmailOnModalOpen,
  emailConfirmed,
  subscribe,
  checkSubscription,
  subscriptionId,
  resendConfirmationEmail,
} = useGenerativeDropNewsletter()

const { canListMintedNft, claimedNft } = useGenerativeDropMint()

const modalStep = ref<ModalStep>(ModalStep.EMAIL)
const email = ref<string>()
const changeEmail = ref(false)
const resentInitialConfirmationEmail = ref(false)

const mintedNFT = computed<MintedNFT | undefined>(() =>
  claimedNft.value
    ? ({
        ...claimedNft.value,
        index: Number(claimedNft.value.sn),
        image: sanitizeIpfsUrl(claimedNft.value.image),
        mimeType: 'text/html',
        collection: {
          id: claimedNft.value.collection,
          name: claimedNft.value.collectionName,
          max: claimedNft.value.max,
        },
      } as MintedNFT)
    : undefined,
)

const { loadedAll, triedAll } = usePreloadImages(
  computed(() => (mintedNFT.value ? [mintedNFT.value] : [])),
)

const mintingSession = computed<MintingSession>(() => ({
  items: [mintedNFT.value as MintedNFT].filter(Boolean),
  txHash: undefined, // free mint does not have a txHash
}))

const subscriptionEmail = computed(
  () => preferencesStore.getNewsletterSubscription.email,
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
  if (loadedAll.value) {
    return true
  }

  return distance.value <= 0 && mintedNFT.value && triedAll.value
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
  subscribe(value)
}

const handleConfirmationEmailResend = () => {
  resendConfirmationEmail(subscriptionId.value as string)
}

const handleEmailSubscriptionCheck = () => {
  checkSubscription(subscriptionId.value as string)
}

watch(
  () => dropStore.loading,
  (claiming) => {
    if (claiming) {
      startCountDown(getCountDownTime(MINTING_SECONDS))
    }
  },
)

watchEffect(() => {
  const claiming = dropStore.loading
  const alreadyConfirmed = emailConfirmed.value && !email.value
  const alreadySubscribed =
    subscriptionEmail.value && !email.value && !changeEmail.value

  if (alreadyConfirmed && isEmailSignupStep.value) {
    modalStep.value = ModalStep.CLAIMING
  } else if (alreadySubscribed && isEmailSignupStep.value) {
    email.value = subscriptionEmail.value
    modalStep.value = ModalStep.CONFIRM_EMAIL
  } else if (
    email.value &&
    isEmailSignupStep.value &&
    subscriptionEmail.value &&
    !subscribingToNewsletter.value
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
      sendConfirmationEmailOnModalOpen.value
    ) {
      handleConfirmationEmailResend()
      resentInitialConfirmationEmail.value = true
    }
  },
)
</script>
