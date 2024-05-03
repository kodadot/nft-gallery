<template>
  <NeoModal :value="vOpen" @close="close">
    <ModalBody
      :title="'Profile Creation'"
      :content-class="stage === 1 ? 'p-0' : undefined"
      @close="close">
      <Introduction v-if="stage === 1" @next="stage = 2" @close="close" />
      <Select v-if="stage === 2" @click="stage = 3" />
      <Form v-if="stage === 3" @submit="handleFormSubmition" />
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
  updateProfile,
} from '@/services/profile'
import { rateLimitedPinFileToIPFS } from '@/services/nftStorage'

const props = defineProps<{
  modelValue: boolean
}>()

const profile = inject<{ hasProfile: Ref<boolean> }>('userProfile')

const hasProfile = computed(() => profile?.hasProfile.value)

const initalStep = computed(() => (hasProfile.value ? 3 : 1))

const emit = defineEmits(['close', 'success'])

const vOpen = useVModel(props, 'modelValue')
const stage = ref(initalStep.value)
const close = () => {
  stage.value = initalStep.value
  vOpen.value = false
  emit('close')
}

const uploadImages = async (
  imageFile: File | undefined,
  bannerFile: File | undefined,
): Promise<[string | undefined, string | undefined]> => {
  const imageUrl = imageFile
    ? await rateLimitedPinFileToIPFS(imageFile)
    : undefined
  const bannerUrl = bannerFile
    ? await rateLimitedPinFileToIPFS(bannerFile)
    : undefined

  return [
    imageUrl ? sanitizeIpfsUrl(imageUrl) : undefined,
    bannerUrl ? sanitizeIpfsUrl(bannerUrl) : undefined,
  ]
}

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
  const [imageUrl, bannerUrl] = await uploadImages(
    profileData.image as File,
    profileData.banner as File,
  )

  const profileBody: CreateProfileRequest | UpdateProfileRequest = {
    address: profileData.address,
    name: profileData.name,
    description: profileData.description,
    image: imageUrl,
    banner: bannerUrl,
    socials: constructSocials(profileData),
  }

  return hasProfile.value
    ? updateProfile(profileBody as UpdateProfileRequest)
    : createProfile(profileBody as CreateProfileRequest)
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
</script>
