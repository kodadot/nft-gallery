<template>
  <NeoModal :value="Vopen" @close="stage = 1">
    <ModalBody :title="'Profile Creation'">
      <div>
        <Stage1 v-if="stage == 1" @click="stage = 2" />
        <Stage2 v-if="stage == 2" @click="stage = 3" />
        <Stage3 v-if="stage == 3" @submit="handleProfileCreation" />
      </div>
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import { ProfileFormData, Stage1, Stage2, Stage3 } from './stages/index'
import { CreateProfileRequest, createProfile } from '@/services/profile'
import { rateLimitedPinFileToIPFS } from '~/services/nftStorage'

const stage = ref(3)

// create a prop and sync it with useVModel

const props = defineProps<{
  modelValue: boolean
}>()

const Vopen = useVModel(props, 'modelValue')

const handleProfileCreation = async (profileData: ProfileFormData) => {
  stage.value = 4 // Transition to a loading or processing stage

  try {
    // Upload images to IPFS
    const imageUrl = sanitizeIpfsUrl(
      await rateLimitedPinFileToIPFS(profileData.image as File),
    )
    const bannerUrl = sanitizeIpfsUrl(
      await rateLimitedPinFileToIPFS(profileData.banner as File),
    )

    console.log(imageUrl, bannerUrl) // For debugging purposes, remove in production or use a

    debugger

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

    debugger
    // Call the createProfile API
    const response = await createProfile(profileRequest)
    if (response.success) {
      stage.value = 5 // Transition to completion or next steps stage
    } else {
      console.error(response.message)
      // Handle error or stay at the current stage with an error message
    }
  } catch (error) {
    console.error(error)
    // Handle error, e.g., by showing an error message to the user
  }
}
</script>
