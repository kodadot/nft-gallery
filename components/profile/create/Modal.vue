<template>
  <NeoModal :value="vOpen" @close="close">
    <ModalBody
      :title="'Profile Creation'"
      :content-class="stage === 1 ? 'p-0' : undefined"
      @close="close">
      <Introduction v-if="stage === 1" @next="stage = 2" @close="close" />
      <Select v-if="stage === 2" @click="stage = 3" />
      <Form v-if="stage === 3" @submit="handleProfileCreation" />
      <Loading v-if="stage === 4" />
      <Success v-if="stage === 5" @close="onProfileCreated" />
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
import { CreateProfileRequest, createProfile } from '@/services/profile'
import { rateLimitedPinFileToIPFS } from '@/services/nftStorage'

const { hasProfile, fetchProfile } = useProfile()

const props = defineProps<{
  modelValue: boolean
}>()

const initalStep = computed(() => (hasProfile.value ? 3 : 1))

const emit = defineEmits(['close', 'success'])

const vOpen = useVModel(props, 'modelValue')
const stage = ref(initalStep.value)
const close = () => {
  stage.value = initalStep.value
  vOpen.value = false
  emit('close')
}

const onProfileCreated = () => {
  emit('success')
  close()
}

const handleProfileCreation = async (profileData: ProfileFormData) => {
  stage.value = 4 // Transition to a loading or processing stage

  try {
    // Upload images to IPFS

    const [imageUrl, bannerUrl] = await Promise.all([
      rateLimitedPinFileToIPFS(profileData.image as File),
      rateLimitedPinFileToIPFS(profileData.banner as File),
    ]).then((imageCIDs) => imageCIDs.map((cid) => sanitizeIpfsUrl(cid)))

    // Create the profile with the uploaded image URLs
    const profileRequest: CreateProfileRequest = {
      address: profileData.address,
      name: profileData.name,
      description: profileData.description,
      image: imageUrl,
      banner: bannerUrl,
      socials: [
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
      ].filter((social) => Boolean(social.handle)),
    }

    const response = await createProfile(profileRequest)
    if (response.success) {
      fetchProfile()
      stage.value = 5
      console.error(response.message)
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
