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
        @submit="handleFormSubmition"
        @delete="handleProfileDelete" />
      <Loading v-if="stage === 4" />
      <Success v-if="stage === 5" @close="close" />
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import {
  Form,
  Introduction,
  Loading,
  ProfileFormData,
  Select,
  Success,
} from './stages/index'
import {
  CreateProfileRequest,
  SocialLink,
  UpdateProfileRequest,
  createProfile,
  deleteProfile,
  updateProfile,
} from '@/services/profile'
import { uploadImage } from '@/services/imageWorker'
import { appClient, createChannel } from '@/services/farcaster'
import { StatusAPIResponse } from '@farcaster/auth-client'
import { useDocumentVisibility } from '@vueuse/core'

const props = defineProps<{
  modelValue: boolean
}>()

const documentVisibility = useDocumentVisibility()
const { $i18n } = useNuxtApp()

const profile = inject<{ hasProfile: Ref<boolean> }>('userProfile')

const hasProfile = computed(() => profile?.hasProfile.value)

const initialStep = computed(() => (hasProfile.value ? 2 : 1))

const emit = defineEmits(['close', 'success', 'deleted'])

const vOpen = useVModel(props, 'modelValue')
const stage = ref(initialStep.value)
const farcasterUserData = ref<StatusAPIResponse>()
const useFarcaster = ref(false)
const farcasterSignInIsInProgress = ref(false)
const close = () => {
  vOpen.value = false
  emit('close')
}

const uploadProfileImage = async (
  file: File | null,
): Promise<string | undefined> =>
  file ? await uploadImage(file).then((response) => response.url) : undefined

const constructSocials = (profileData: ProfileFormData): SocialLink[] => {
  return [
    {
      handle: profileData.farcasterHandle || '',
      platform: 'Farcaster',
      link: `https://warpcast.com/${profileData.farcasterHandle}`,
    },
    {
      handle: profileData.twitterHandle || '',
      platform: 'Twitter',
      link: `https://twitter.com/${profileData.twitterHandle}`,
    },
    {
      handle: profileData.website || '',
      platform: 'Website',
      link: profileData.website || '',
    },
  ].filter((social) => Boolean(social.handle))
}

const processProfile = async (profileData: ProfileFormData) => {
  const imageUrl = profileData.image
    ? await uploadProfileImage(profileData.image)
    : profileData.imagePreview

  const bannerUrl = profileData.banner
    ? await uploadProfileImage(profileData.banner)
    : profileData.bannerPreview

  const profileBody: CreateProfileRequest | UpdateProfileRequest = {
    address: profileData.address,
    name: profileData.name,
    description: profileData.description,
    image: imageUrl,
    banner: hasProfile.value ? bannerUrl ?? null : bannerUrl!,
    socials: constructSocials(profileData),
  }

  return hasProfile.value
    ? updateProfile(profileBody as UpdateProfileRequest)
    : createProfile(profileBody as CreateProfileRequest)
}

const handleProfileDelete = async (address: string) => {
  try {
    await deleteProfile(address)
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
  stage.value = 4 // Go to loading stage
  try {
    await processProfile(profileData)
    emit('success')
    stage.value = 5 // Go to success stage
  } catch (error) {
    stage.value = 3 // Back to form stage
    warningMessage(error!.toString())
    console.error(error)
  }
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

watch(
  () => props.modelValue,
  () => {
    stage.value = initialStep.value
  },
)
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
</script>
