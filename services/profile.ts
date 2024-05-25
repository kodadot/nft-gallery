import { $fetch, FetchError } from 'ofetch'
import { isEthereumAddress } from '@polkadot/util-crypto'

const BASE_URL =
  window.location.host === 'kodadot.xyz'
    ? 'https://profile.kodadot.workers.dev/'
    : 'https://profile-beta.kodadot.workers.dev/'

const api = $fetch.create({
  baseURL: BASE_URL,
})

// Types for API request and response objects
export type Profile = {
  address: string
  name: string
  description: string
  image: string
  banner: string | null
  socials: SocialLink[]
}

export type Follower = {
  address: string
  name: string
  description: string
  image: string
}

export type SocialLink = {
  handle?: string
  platform: string
  link: string
}

export type ProfileResponse = {
  success: boolean
  message: string
  data?: Profile
  profileId?: string
}

export type CreateProfileRequest = {
  address: string
  name: string
  description: string
  image: string
  banner: string
  socials: SocialLink[]
}

export type UpdateProfileRequest = {
  address: string
  name?: string
  description?: string
  image?: string
  banner?: string
  socials: SocialLink[]
}

export type FollowRequest = {
  initiatorAddress: string
  targetAddress: string
}

export const toSubstrateAddress = (address: string) =>
  isEthereumAddress(address) ? address : formatAddress(address, 42)

const convertToSubstrateAddress = (body: FollowRequest): FollowRequest => ({
  initiatorAddress: toSubstrateAddress(body.initiatorAddress),
  targetAddress: toSubstrateAddress(body.targetAddress),
})

// API methods

export const fetchProfilesByIds = (ids?: string[]) =>
  api<Profile[]>('/profiles', {
    method: 'GET',
    query: { ids: ids?.map(toSubstrateAddress).join(',') },
  })

export const fetchProfileByAddress = (address: string) =>
  api<Profile>(`/profiles/${toSubstrateAddress(address)}`, {
    method: 'GET',
  })

export const fetchFollowersOf = (
  address: string,
  options?: { limit?: number; offset?: number; exclude?: string[] },
) =>
  api<{ followers: Follower[]; totalCount: number }>(
    `/follow/${toSubstrateAddress(address)}/followers`,
    {
      method: 'GET',
      query: {
        limit: options?.limit,
        offset: options?.offset,
        exclude: options?.exclude?.map(toSubstrateAddress).join(','),
      },
    },
  )

export const fetchFollowing = (
  address: string,
  options?: { limit?: number; offset?: number },
) =>
  api<{ following: Follower[]; totalCount: number }>(
    `/follow/${toSubstrateAddress(address)}/following`,
    {
      method: 'GET',
      query: { limit: options?.limit, offset: options?.offset },
    },
  )

export const createProfile = async (profileData: CreateProfileRequest) => {
  try {
    const response = await api<ProfileResponse>('/profiles', {
      method: 'POST',
      body: profileData,
    })
    return response
  } catch (error) {
    throw new Error(
      `[PROFILE::CREATE] ERROR: ${(error as FetchError)?.data?.error?.issues[0]?.message}`,
    )
  }
}

export const updateProfile = async (updates: UpdateProfileRequest) => {
  try {
    const response = await api<ProfileResponse>(
      `/profiles/${updates.address}`,
      {
        method: 'PATCH',
        body: updates,
      },
    )
    return response
  } catch (error) {
    throw new Error(
      `[PROFILE::UPDATE] ERROR: ${(error as FetchError)?.data?.error?.issues[0]?.message}`,
    )
  }
}

export const follow = async (followRequest: FollowRequest) => {
  try {
    const response = await api<ProfileResponse>('/follow', {
      method: 'POST',
      body: convertToSubstrateAddress(followRequest),
    })
    return response
  } catch (error) {
    throw new Error(`[PROFILE::FOLLOW] ERROR: ${(error as FetchError).data}`)
  }
}

export const unfollow = async (unFollowRequest: FollowRequest) => {
  try {
    const response = await api<ProfileResponse>('/follow', {
      method: 'DELETE',
      body: convertToSubstrateAddress(unFollowRequest),
    })
    return response
  } catch (error) {
    throw new Error(`[PROFILE::UNFOLLOW] ERROR: ${(error as FetchError).data}`)
  }
}

export const isFollowing = async (
  follower: string,
  target: string,
): Promise<boolean> => {
  try {
    const response = await api<{ isFollowing: boolean }>(
      `/follow/${toSubstrateAddress(follower)}/follows/${toSubstrateAddress(target)}`,
      {
        method: 'GET',
      },
    )
    return response.isFollowing
  } catch (error) {
    throw new Error(
      `[PROFILE::IS_FOLLOWING] ERROR: ${(error as FetchError).data}`,
    )
  }
}
