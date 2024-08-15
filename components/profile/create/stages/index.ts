export { default as Introduction } from './Introduction.vue'
export { default as Select } from './Select.vue'
export { default as Form } from './Form.vue'

export type ProfileFormData = {
  address: string
  name: string
  description: string
  image: File | null
  banner: File | null
  farcasterHandle?: string
  twitterHandle?: string
  website?: string
  imagePreview?: string
  bannerPreview?: string
}
