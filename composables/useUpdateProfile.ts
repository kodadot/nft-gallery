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
import { ProfileFormData } from '@/components/profile/create/stages'

export default async ({
  profileData,
  signaturePair,
  hasProfile,
  useFarcaster,
}: {
  profileData: ProfileFormData
  signaturePair: SignaturePair
  hasProfile: boolean
  useFarcaster: boolean
}) => {
  const imageUrl = profileData.image
    ? await uploadProfileImage({
        file: profileData.image,
        type: 'image',
        signaturePair,
      })
    : profileData.imagePreview

  const bannerUrl = profileData.banner
    ? await uploadProfileImage({
        file: profileData.banner,
        type: 'banner',
        signaturePair,
      })
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
    signature: signaturePair.signature,
    message: signaturePair.message,
  }

  return hasProfile
    ? updateProfile(profileBody as UpdateProfileRequest)
    : createProfile(profileBody as CreateProfileRequest)
}
