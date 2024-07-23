<template>
  <NeoModal :value="vOpen" @close="close">
    <ModalBody
      :title="'Profile Creation'"
      :content-class="stage === 1 ? 'p-0' : undefined"
      @close="close">
      <Introduction v-if="stage === 1" @next="stage = 2" @close="close" />
      <Select
        v-if="stage === 2"
        :loading="farcasterSignInIsInProgress"
        @start-new="OnSelectStartNew"
        @import-farcaster="onSelectFarcaster" />
      <Form
        v-if="stage === 3"
        :farcaster-user-data="farcasterUserData"
        :use-farcaster="useFarcaster"
        :signing-message="signingMessage"
        @submit="handleFormSubmition"
        @delete="handleProfileDelete" />
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import { Form, Introduction, ProfileFormData, Select } from './stages/index'
import { deleteProfile } from '@/services/profile'
import { appClient, createChannel } from '@/services/farcaster'
import { StatusAPIResponse } from '@farcaster/auth-client'
import { useDocumentVisibility } from '@vueuse/core'

type SessionState = {
  state: LoadingNotificationState
  error?: Error
}

const emit = defineEmits(['close', 'success', 'deleted'])
const props = defineProps<{
  modelValue: boolean
}>()

const vOpen = useVModel(props, 'modelValue')
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { $i18n } = useNuxtApp()
const { getSignaturePair } = useVerifyAccount()
const profileStore = useProfileStore()
const documentVisibility = useDocumentVisibility()
const { add: generateSession, get: getSession } = useIdMap<Ref<SessionState>>()

const profile = inject<{ hasProfile: Ref<boolean> }>('userProfile')

const signingMessage = ref(false)
const farcasterUserData = ref<StatusAPIResponse>()
const useFarcaster = ref(false)
const farcasterSignInIsInProgress = ref(false)

const hasProfile = computed(() => Boolean(profile?.hasProfile.value))
const initialStep = computed(() => (hasProfile.value ? 2 : 1))
const stage = ref(initialStep.value)

const close = () => {
  vOpen.value = false
  emit('close')
}

const handleProfileDelete = async (address: string) => {
  try {
    const { signature, message } = await getSignaturePair()
    await deleteProfile({ address, message, signature })
    infoMessage($i18n.t('profiles.profileHasBeenCleared'), {
      title: $i18n.t('profiles.profileReset'),
    })
    emit('deleted')
    close()
  } catch (error) {
    warningMessage(error!.toString())
    console.error(error)
  }
}

const handleFormSubmition = async (profileData: ProfileFormData) => {
  let signaturePair: undefined | SignaturePair

  try {
    signingMessage.value = true
    signaturePair = await getSignaturePair()
    signingMessage.value = false
    close()
    onModalAnimation(() => {
      stage.value = 4 // Go to loading stage
    })
  } catch (error) {
    stage.value = 3 // Back to form stage
    reset()
    warningMessage(error!.toString())
    console.error(error)
  }

  if (!signaturePair) {
    return
  }

  // profileStore.$onAction handles flow
  await profileStore.processProfile({
    profileData,
    signaturePair,
    hasProfile: hasProfile.value,
    useFarcaster: useFarcaster.value,
  })
}

const profileCreated = (sessionId: string) => {
  emit('success')
  stage.value = 5 // Go to success stage
  updateSession(sessionId, { state: 'succeeded' })
}

const reset = () => {
  signingMessage.value = false
}

const profileCreationFailed = (sessionId: string, error: Error) => {
  reset()
  console.error(error)
  updateSession(sessionId, { state: 'failed', error: error })
}

const onSelectFarcaster = () => {
  if (farcasterUserData.value) {
    stage.value = 3
    useFarcaster.value = true
  } else {
    farcasterSignInIsInProgress.value = true
    loginWithFarcaster()
      .then(() => {
        farcasterSignInIsInProgress.value = false
        stage.value = 3
        useFarcaster.value = true
      })
      .catch((error) => {
        farcasterSignInIsInProgress.value = false
        console.error(error)
        dangerMessage(
          $i18n.t('profiles.errors.unsuccessfulFarcasterAuth.message'),
          {
            title: $i18n.t('profiles.errors.unsuccessfulFarcasterAuth.title'),
            reportable: false,
          },
        )
      })
  }
}

const OnSelectStartNew = () => {
  stage.value = 3
  useFarcaster.value = false
}

const loginWithFarcaster = async () => {
  const channel = await createChannel()

  if (!channel?.data?.url) {
    throw new Error('[PROFILES::FARCASTER_AUTH] URL not found in channel data')
  }

  // Open a new tab with the URL
  const farcasterTab = window.open(channel.data.url, '_blank')
  const userData = await appClient.watchStatus({
    channelToken: channel.data.channelToken,
    timeout: 60_000,
    interval: 1_000,
  })

  farcasterTab?.close()

  const stateNotCompleted = userData?.data?.state !== 'completed'
  const nonceMismatch = userData.data?.nonce !== channel.data?.nonce

  if (stateNotCompleted || nonceMismatch) {
    throw new Error(
      `[PROFILES::FARCASTER_AUTH] ${stateNotCompleted ? 'No user data found' : 'Nonce mismatch'}`,
    )
  }

  farcasterUserData.value = userData.data
}

useModalIsOpenTracker({
  isOpen: computed(() => props.modelValue),
  onClose: false,
  onChange: () => {
    stage.value = initialStep.value
  },
})

watch(documentVisibility, (current, previous) => {
  if (
    current === 'visible' &&
    previous === 'hidden' &&
    farcasterSignInIsInProgress.value
  ) {
    infoMessage($i18n.t('profiles.errors.unconfrimedFarcasterAuth.message'), {
      title: $i18n.t('profiles.errors.unconfrimedFarcasterAuth.title'),
    })
  }
})

const updateSession = (id: string, newSession: SessionState) => {
  const session = getSession(id)

  if (!session) {
    return
  }

  session.value = newSession
}

profileStore.$onAction(({ name, after, onError }) => {
  if (name === 'processProfile') {
    const sessionId = generateSession(
      ref({
        state: 'loading',
      }),
    )

    const session = getSession(sessionId)

    if (!session) {
      return
    }

    const isSessionState = (state: LoadingNotificationState) =>
      session.value?.state === state

    updateSession(sessionId, { state: 'loading' })

    loadingMessage({
      title: computed(() =>
        isSessionState('failed')
          ? $i18n.t('profiles.errors.setupFailed.title')
          : $i18n.t('profiles.created'),
      ),
      message: computed(() =>
        isSessionState('failed')
          ? $i18n.t('profiles.errors.setupFailed.message')
          : undefined,
      ),
      state: computed(() => session?.value.state as LoadingNotificationState),
      action: computed<NotificationAction | undefined>(() => {
        if (isSessionState('failed')) {
          return getReportIssueAction(
            session?.value?.error?.toString() as string,
          )
        }

        if (isSessionState('succeeded')) {
          return {
            label: $i18n.t('viewProfile'),
            icon: 'arrow-up-right',
            url: `/${urlPrefix.value}/u/${accountId.value}`,
          }
        }
      }),
    })
    after(() => profileCreated(sessionId))
    onError((error) => profileCreationFailed(sessionId, error as Error))
  }
})
</script>
