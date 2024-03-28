import { $fetch } from 'ofetch'

export type UserProfileData = {
  bannerImage?: string
  avatar: string
  name?: string
  description?: string
  followers?: number
  following?: number
  followersAvatars?: string[]
}

const mockProfileData: UserProfileData = {
  bannerImage:
    'https://s3-alpha-sig.figma.com/img/a754/fbdc/a687a9843b536b0d5292ce53c3c8ff47?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Lp0ACavV8A9ViM8gzSjHC6M5oO3hGjazkBBg-8ksEQTT03YUzfvqt5d-M~Ukr3t6-CIdEX3YeJeHc7U7pb1AM~POh~YjkikzMfuTvmk9KvIjcSkvGDNpkydAtjAVT7eCwMT9nqVzZ2OpYHiBCtC7KgUpLSbUCcL03iCc7hb1b6on3Wx0ouWUb97MQge0uBHcw4Cia-jCRl8Lyk99bZyVX9Riq8hNITDa5QN4oLTgNDMidzi2khZlI4iTXNpbwj~1JKyVA7ZWNlElFNnBKTZQX~9OQUb36MNbqIZdHOOaeSsMY-EQQfoaik~SzFO1SgyZkdVnw2nxDSQi7o0dEdR32g__',
  avatar:
    'https://s3-alpha-sig.figma.com/img/30d9/ae90/9b1922befd95754a1314bb3739e46a06?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JXjNgwHHHWgb0Hx~TGrqpVNafAjdozel-XGsswPTtB~D5Twazf75QEsciWxgasxcOR7-DAS37jVs0NHu-zDBGuwG~PdF8Fd~ofwqxZ~zSNZLEidrBIuc0n9T7bgXhedXmbJGQB-N4zVencj0~k8U~xofP1jGdWIB-vV8DJqxcxN7-L024vEM6jp0QZFftI0e9-S-C4bcZeecm8axUe9HWipD-M7yYpClJ4tQ~9vfmxuQBVTLAk0Spin37sxRcCmujVXcMqNnuyjTxF~ho8i9LbEtTapAKSILoHLIaPaIEymIy-88P77PuXJuQtWTzIow~JAarZx-2P3jolzyWPqF0g__',
  name: 'John Doe',
  description:
    'Lorem ipsum dolor sit amet consectetur. Turpis elit magna nunc eget. Non in a semper tristique bibendum ut. Habitant metus facilisis in lacus sollicitudin orci tellus a eget dignissim hac pellentesque.',
  followers: 87,
  following: 11,
  followersAvatars: [
    'https://s3-alpha-sig.figma.com/img/defd/9443/1a5e19988cbfbf8d0329bf17467738ac?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=msu-zurKcBs7bJR5KSZEpM8SfNC~Mhf~JiQLz~ytozJ-pxn8cVTTf9qH3Oo3IUtid55azQBak2m3qpxW8Hhgpw0CM8gvC5W2mCsENg3KtLQuJBvG5fsokZJFiyHwZtOoGHkoBl72Uqcw4fF46g9v96-C2pau-Z6FB3qta2xuodo6~8~aFiO5Dkuk5yLos8ppSZWk9uhJ03nXhFhjYzXd4X5emn7ZIZEOp1kjXWRUFz~S~E7QbvgAfKDTfsla9o1yyJg80BgEf1RDxq9yQWptLiC9aRr3Znsko0fB1pteZRy1Ulmsr4mwQM3A5k2fRjwzRb5Cy6R8d3esA31r1fHOgw__',
    'https://s3-alpha-sig.figma.com/img/8d35/711a/ce91ea5fd87f6976b04bb97f94fedf6a?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Fw8u~nTPOsBXGIKHK17Ts4g1Lagg1SaotKL~SRHdJjLBIUo6OU-fm0LFajJLkWwI1-OKaWFu0ded3ibq974z22AkheGD0AFTV0wghsCMzjsAYrV5pY6kNeu1PiyjdSsDFHR5bdy~thABV7NRJiEeEd85gEyIPxDUBx8c9DjGBKE5e7dbt4cP1WDEMEyWoFnqC7eh5iq5nkjAfRq~h3Yhi6H6bIUP3E8fMh9TNkv9t1kXZFLIq00YbG~eOoCHt3CqAAje0ofMN5LGIrx7472RYs9wOU8qJB1eOMkkvg9vn0N4~EnLwjDoXZ3mickC5~2955sOmQPOGFmT0HiQvxy6SQ__',
    'https://s3-alpha-sig.figma.com/img/e8cc/a1ff/881565b7bf767070aa1ba9925e186be7?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=j~HRVDwz2svnmc33xPSeD-YF-jGrlYwKl0z3Fig8ahw0ueVZ9U1X0r4sHNsVz5wA~7P4bu4vjZAA17mdVnucxWO3nBECvt2yel8ISxHfBlMALHqMfHmO2K2MGbm5nc5DZzyauHNiHbMPiuHQ4beL2PqOdn41RIXPiTgcUl6uo8lTI7btvRckAvbd-NXBWr9UNyf4A~8ll55xaJdMgrdp94SzpTv2HvTbbfWYiKf5EbwFdBAsSVqnxkKiLrXfOmsYxAlA8L3Go3dCF~Bsa9VJ61D46CmnV477qWFGAx0jtWqTo8c1qQw~wKJyu0K1AiYdRSLhiTJLvNf0VFv7twMatw__',
  ],
}

export default function useUserProfile() {
  const { accountId } = useAuth()
  const { isLightMode } = useTheme()

  const defaultAvatar = computed(() =>
    isLightMode.value ? '/default-avatar.svg' : '/default-avatar-dark.svg',
  )
  // for dev only - remove when done
  const { query, params } = useRoute()

  const userProfileData = ref<UserProfileData>()
  const hasProfile = ref(false)
  const mock = computed(() => query.mock === 'true')
  const isFollowingThisAccount = ref(false)

  const follow = async (who?: string) => {
    const followee = who || params.id
    //for now just toggle the follow state
    console.log('Following:', followee)
    isFollowingThisAccount.value = true
  }

  const fetchProfileMedia = async () => {
    if (mock.value) {
      userProfileData.value = mockProfileData
      hasProfile.value = true
      return
    }

    try {
      const data = await $fetch(`/path/to/user/media/${accountId.value}`)
      if (data && data.status === 200) {
        userProfileData.value = {
          bannerImage: data.bannerImage,
          avatar: data.avatarImage || defaultAvatar,
          name: data.userName,
          followers: data.followers,
          following: data.following,
          followersAvatars: data.followersAvatars.slice(0, 3),
        }

        hasProfile.value = true
      } else {
        throw new Error('Unable to fetch user media')
      }
    } catch (error) {
      console.error('Failed to fetch user profile images:', error)
    }
  }

  watch(accountId, fetchProfileMedia, { immediate: true })

  return {
    hasProfile,
    isFollowingThisAccount,
    userProfile: computed(() => ({
      ...userProfileData.value,
      avatar: userProfileData.value?.avatar || defaultAvatar.value,
    })),
    follow,
  }
}
