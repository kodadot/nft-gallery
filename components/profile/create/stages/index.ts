export { default as Stage1 } from './Stage1.vue'
export { default as Stage2 } from './Stage2.vue'
export { default as Stage3 } from './Stage3.vue'

export type ProfileFormData = {
  address: string
  name: string
  description: string
  image: File | null
  banner: File | null
  farcasterHandle: string | null
  twitterHandle: string | null
  website: string | null
}
