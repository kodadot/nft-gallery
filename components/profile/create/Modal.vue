<template>
  <NeoModal
    :value="vOpen"
    @close="close"
  >
    <ModalBody
      :title="'Profile Creation'"
      :content-class="stage === 1 ? 'p-0' : undefined"
      @close="close"
    >
      <Introduction
        v-if="stage === 1"
        @next="stage = 2"
        @close="close"
      />
      <Select
        v-if="stage === 2"
        :loading="farcasterSignInIsInProgress"
        @start-new="OnSelectStartNew"
        @import-farcaster="onSelectFarcaster"
      />
      <Form
        v-if="stage === 3"
        :farcaster-user-data="farcasterUserData"
        :use-farcaster="useFarcaster"
        :signing-message="signingMessage"
        @submit="handleFormSubmition"
        @delete="handleProfileDelete"
      />
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'

import type { StatusAPIResponse } from '@farcaster/auth-client'
import { useDocumentVisibility } from '@vueuse/core'
import {
  Form,
  Introduction,
  Select,
  type ProfileFormData,
} from './stages/index'
import { deleteProfile } from '@/services/profile'
import { appClient, createChannel } from '@/services/farcaster'

type SessionState = {
  state: LoadingNotificationState
  error?: Error
}

const emit = defineEmits(['close', 'success', 'deleted'])
const props = defineProps<{
  skipIntro?: boolean
}>()

const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { $i18n } = useNuxtApp()
const { getProfileVersionedSignaturePair } = useVerifyAccount()
const documentVisibility = useDocumentVisibility()
const { add: generateSession, get: getSession } = useIdMap<Ref<SessionState>>()
const { fetchProfile } = useProfile()

const { hasProfile, userProfile } = useProfile()
provide('userProfile', { hasProfile, userProfile })

const initialStep = computed(() => (props.skipIntro || hasProfile.value ? 2 : 1))

const signingMessage = ref(false)
const vOpen = ref(true)
const stage = ref(initialStep.value)
const farcasterUserData = ref<StatusAPIResponse>()
const useFarcaster = ref(false)
const farcasterSignInIsInProgress = ref(false)

const close = () => {
  vOpen.value = false
  emit('close')
}

const handleProfileDelete = async (profileData: ProfileFormData) => {
  try {
    const { signature, message } = await getProfileVersionedSignaturePair(profileData.address)
    await deleteProfile({ address: profileData.address, message, signature })
    infoMessage($i18n.t('profiles.profileHasBeenCleared'), {
      title: $i18n.t('profiles.profileReset'),
    })
    emit('deleted')
    fetchProfile()
    close()
  }
  catch (error) {
    warningMessage(error!.toString())
    console.error(error)
  }
}

const handleFormSubmition = async (profileData: ProfileFormData) => {
  let signaturePair: undefined | SignaturePair

  try {
    signingMessage.value = true
    signaturePair = await getProfileVersionedSignaturePair(profileData.address)
    signingMessage.value = false
    close()
    onModalAnimation(() => {
      stage.value = 4 // Go to loading stage
    })
  }
  catch (error) {
    stage.value = 3 // Back to form stage
    reset()
    warningMessage(error!.toString())
    console.error(error)
  }

  if (!signaturePair) {
    return
  }

  const sessionId = generateSession(
    ref({
      state: 'loading',
    }),
  )

  const session = getSession(sessionId)
  if (!session) {
    return
  }

  // using a seperate try catch to show errors using the profile creation notification
  try {
    showProfileCreationNotification(session)

    await useUpdateProfile({
      profileData,
      signaturePair,
      hasProfile: hasProfile.value,
      useFarcaster: useFarcaster.value,
    })

    profileCreated(sessionId)
  }
  catch (error) {
    profileCreationFailed(sessionId, error as Error)
  }
}

const showProfileCreationNotification = (session: Ref<SessionState>) => {
  const isSessionState = (state: LoadingNotificationState) =>
    session.value?.state === state

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
        return getReportIssueAction(session?.value?.error?.toString() as string)
      }

      if (isSessionState('succeeded')) {
        return {
          label: $i18n.t('viewProfile'),
          icon: 'arrow-up-right',
          url: `/${urlPrefix.value}/u/${accountId.value}`,
        }
      }

      return undefined
    }),
  })
}

const profileCreated = (sessionId: string) => {
  emit('success')
  fetchProfile()
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
  }
  else {
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

const updateSession = (id: string, newSession: SessionState) => {
  const session = getSession(id)

  if (!session) {
    return
  }

  session.value = newSession
}

useModalIsOpenTracker({
  isOpen: vOpen,
  onClose: false,
  onChange: () => {
    stage.value = initialStep.value
  },
})

watch(documentVisibility, (current, previous) => {
  if (
    current === 'visible'
    && previous === 'hidden'
    && farcasterSignInIsInProgress.value
  ) {
    infoMessage($i18n.t('profiles.errors.unconfrimedFarcasterAuth.message'), {
      title: $i18n.t('profiles.errors.unconfrimedFarcasterAuth.title'),
    })
  }
})
</script>
