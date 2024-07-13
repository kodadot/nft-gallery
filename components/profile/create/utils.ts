import { SocialLink, uploadImage } from '@/services/profile'
import { ProfileFormData } from './stages'

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
  ].filter((social) => Boolean(social.handle))
}

export const uploadProfileImage = async (
  file: File | null,
  type: 'image' | 'banner',
): Promise<string | undefined> => {
  if (!file) {
    return undefined
  }

  const { getSignaturePair } = useVerifyAccount()
  const { accountId } = useAuth()

  const { signature, message } = await getSignaturePair()

  const response = await uploadImage({
    file,
    type,
    address: accountId.value,
    signature,
    message,
  })

  return response.url
}
