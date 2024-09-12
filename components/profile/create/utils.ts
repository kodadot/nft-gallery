import type { ProfileFormData } from './stages'
import type { SocialLink } from '@/services/profile'
import { uploadImage } from '@/services/profile'

export const constructSocials = (
  profileData: ProfileFormData,
): SocialLink[] => {
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
  ].filter(social => Boolean(social.handle))
}

export const uploadProfileImage = async ({
  file,
  type,
  signaturePair: { signature, message },
}: {
  file: File | null
  type: 'image' | 'banner'
  signaturePair: SignaturePair
}): Promise<string | undefined> => {
  if (!file) {
    return undefined
  }

  const { accountId } = useAuth()

  const response = await uploadImage({
    file,
    type,
    address: accountId.value,
    signature,
    message,
  })

  return response.url
}
