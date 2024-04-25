import { $fetch, FetchError } from 'ofetch'

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
  banner: string
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

// API methods

export const fetchProfiles = (limit?: number) =>
  api<Profile[]>('/profiles', {
    method: 'GET',
    query: { limit },
  })

export const fetchProfileByAddress = (address: string) =>
  api<Profile>(`/profiles/${formatAddress(address, 42)}`, {
    method: 'GET',
  })

export const fetchFollowersOf = (
  address: string,
  limit?: number,
  offset?: number,
) =>
  api<{ followers: Follower[]; totalCount: number }>(
    `/follow/${formatAddress(address, 42)}/followers`,
    {
      method: 'GET',
      query: { limit, offset },
    },
  )

export const fetchFollowing = (
  address: string,
  limit?: number,
  offset?: number,
) =>
  api<{ following: Follower[]; totalCount: number }>(
    `/follow/${formatAddress(address, 42)}/following`,
    {
      method: 'GET',
      query: { limit, offset },
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
    throw new Error(`[PROFILE::CREATE] ERROR: ${(error as FetchError).data}`)
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
    throw new Error(`[PROFILE::UPDATE] ERROR: ${(error as FetchError).data}`)
  }
}
