import { defineStore } from 'pinia'
import { ProfileFormData } from '@/components/profile/create/stages'
import {
  CreateProfileRequest,
  UpdateProfileRequest,
  createProfile,
  updateProfile,
} from '@/services/profile'
import { getBioWithLinks } from '@/components/profile/utils'
import {
  constructSocials,
  uploadProfileImage,
} from '@/components/profile/create/utils'

interface State {}

export const useProfileStore = defineStore('profile', {
  state: (): State => ({}),
  actions: {
    async processProfile({
      profileData,
      signaturePair: { signature, message },
      hasProfile,
      useFarcaster,
    }: {
      profileData: ProfileFormData
      signaturePair: SignaturePair
      hasProfile: boolean
      useFarcaster: boolean
    }) {
      const imageUrl = profileData.image
        ? await uploadProfileImage(profileData.image, 'image')
        : profileData.imagePreview

      const bannerUrl = profileData.banner
        ? await uploadProfileImage(profileData.banner, 'banner')
        : profileData.bannerPreview

      const profileBody: CreateProfileRequest | UpdateProfileRequest = {
        address: profileData.address,
        name: profileData.name,
        description: useFarcaster
          ? getBioWithLinks(profileData.description)
          : profileData.description,
        image: imageUrl,
        banner: hasProfile ? (bannerUrl ?? null) : bannerUrl!,
        socials: constructSocials(profileData),
        signature,
        message,
      }

      return hasProfile
        ? updateProfile(profileBody as UpdateProfileRequest)
        : createProfile(profileBody as CreateProfileRequest)
    },
  },
})
