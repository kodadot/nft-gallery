import { $fetch, FetchError } from 'ofetch'

const hostToServiceMap = {
  'kodadot.xyz': 'https://profile.kodadot.workers.dev/',
  'canary.kodadot.xyz': 'https://profile-beta.kodadot.workers.dev/',
  'localhost:9090': 'http://localhost:8787',
}

const BASE_URL = hostToServiceMap[window.location.host]

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
  name?: string
  description?: string
  image?: string
  banner?: string
}

// API methods

export const fetchProfiles = async (limit?: number) => {
  return await api<Profile[]>('/profiles', {
    method: 'GET',
    query: { limit },
  })
}

export const fetchProfileByAddress = async (address: string) => {
  return await api<Profile>(`/profiles/${formatAddress(address, 42)}`, {
    method: 'GET',
  })
}

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

export const updateProfile = async (
  address: string,
  updates: UpdateProfileRequest,
) => {
  try {
    const response = await api<ProfileResponse>(`/profiles/${address}`, {
      method: 'PATCH',
      body: updates,
    })
    return response
  } catch (error) {
    throw new Error(`[PROFILE::UPDATE] ERROR: ${(error as FetchError).data}`)
  }
}
