import { $fetch } from 'ofetch'

export enum Socials {
  Twitter,
  Website,
  Farcaster,
}

export type UserProfileData = {
  bannerImage: string
  avatar: string
  name: string
  description: string
  followers: number
  following: number
  followersAvatars: string[]
  socials?: { [key in Socials]?: string }
}

const mockProfileData: UserProfileData = {
  bannerImage:
    'https://pbs.twimg.com/profile_banners/19893776/1672062169/1500x500',
  avatar:
    'https://upload.wikimedia.org/wikipedia/en/f/ff/Timoth%C3%A9e_Chalamet_as_Paul_Atreides_%28Dune_2021%29.jpg',
  name: 'Paul Atreides',
  description:
    '"I will bend like a reed in the wind" • Not affiliated with any known literature or cinematic experience.',
  followers: 87,
  following: 11,
  followersAvatars: [
    'https://s3-alpha-sig.figma.com/img/defd/9443/1a5e19988cbfbf8d0329bf17467738ac?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=msu-zurKcBs7bJR5KSZEpM8SfNC~Mhf~JiQLz~ytozJ-pxn8cVTTf9qH3Oo3IUtid55azQBak2m3qpxW8Hhgpw0CM8gvC5W2mCsENg3KtLQuJBvG5fsokZJFiyHwZtOoGHkoBl72Uqcw4fF46g9v96-C2pau-Z6FB3qta2xuodo6~8~aFiO5Dkuk5yLos8ppSZWk9uhJ03nXhFhjYzXd4X5emn7ZIZEOp1kjXWRUFz~S~E7QbvgAfKDTfsla9o1yyJg80BgEf1RDxq9yQWptLiC9aRr3Znsko0fB1pteZRy1Ulmsr4mwQM3A5k2fRjwzRb5Cy6R8d3esA31r1fHOgw__',
    'https://s3-alpha-sig.figma.com/img/8d35/711a/ce91ea5fd87f6976b04bb97f94fedf6a?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Fw8u~nTPOsBXGIKHK17Ts4g1Lagg1SaotKL~SRHdJjLBIUo6OU-fm0LFajJLkWwI1-OKaWFu0ded3ibq974z22AkheGD0AFTV0wghsCMzjsAYrV5pY6kNeu1PiyjdSsDFHR5bdy~thABV7NRJiEeEd85gEyIPxDUBx8c9DjGBKE5e7dbt4cP1WDEMEyWoFnqC7eh5iq5nkjAfRq~h3Yhi6H6bIUP3E8fMh9TNkv9t1kXZFLIq00YbG~eOoCHt3CqAAje0ofMN5LGIrx7472RYs9wOU8qJB1eOMkkvg9vn0N4~EnLwjDoXZ3mickC5~2955sOmQPOGFmT0HiQvxy6SQ__',
    'https://s3-alpha-sig.figma.com/img/e8cc/a1ff/881565b7bf767070aa1ba9925e186be7?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=j~HRVDwz2svnmc33xPSeD-YF-jGrlYwKl0z3Fig8ahw0ueVZ9U1X0r4sHNsVz5wA~7P4bu4vjZAA17mdVnucxWO3nBECvt2yel8ISxHfBlMALHqMfHmO2K2MGbm5nc5DZzyauHNiHbMPiuHQ4beL2PqOdn41RIXPiTgcUl6uo8lTI7btvRckAvbd-NXBWr9UNyf4A~8ll55xaJdMgrdp94SzpTv2HvTbbfWYiKf5EbwFdBAsSVqnxkKiLrXfOmsYxAlA8L3Go3dCF~Bsa9VJ61D46CmnV477qWFGAx0jtWqTo8c1qQw~wKJyu0K1AiYdRSLhiTJLvNf0VFv7twMatw__',
  ],
  socials: {
    [Socials.Twitter]: 'PaulAtreides',
    [Socials.Website]: 'https://dune.fandom.com/wiki/Paul_Atreides',
    [Socials.Farcaster]: 'PaulAtreides',
  },
}
export default function useUserProfile() {
  const { accountId } = useAuth()

  // for dev only - remove when done
  const { query, params } = useRoute()

  const userProfileData = ref<UserProfileData>()
  const hasProfile = ref(false)
  const mock = computed(() => query.mock === 'true')
  const isFollowingThisAccount = ref(false)

  const setFollowing = async (follow: boolean, who?: string) => {
    const followee = who || params.id
    //for now just toggle the follow state
    console.log('Following:', followee)
    isFollowingThisAccount.value = follow
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
          avatar: data.avatarImage,
          name: data.userName,
          followers: data.followers,
          following: data.following,
          followersAvatars: data.followersAvatars.slice(0, 3),
          description: data.description,
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
    userProfile: computed(() => userProfileData.value),
    follow: setFollowing,
  }
}
