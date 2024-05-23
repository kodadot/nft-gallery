<template>
  <div class="flex flex-col gap-10">
    <div class="flex flex-col gap-3">
      <span>Setting your profile for</span>
      <CollectionDropCreatedBy :address="substrateAddress" />
    </div>
    <form class="flex flex-col gap-10" @submit.prevent>
      <!-- name -->
      <NeoField
        :label="`Your Name`"
        required
        :error="!form.name"
        label-class="!text-xl">
        <NeoInput
          v-model="form.name"
          data-testid="create-profile-input-name"
          required
          :placeholder="'Enter Your Name'" />
      </NeoField>

      <!-- bio -->
      <NeoField
        :label="`Short Bio`"
        required
        :error="!form.description"
        label-class="!text-xl">
        <NeoInput
          v-model="form.description"
          data-testid="create-profile-input-bio"
          required
          type="textarea"
          :maxlength="200"
          has-counter
          counter-class="mt-3"
          :placeholder="'introduce yourself in a few words'" />
      </NeoField>

      <!-- profile picture -->
      <NeoField
        :label="`Upload profile picture`"
        required
        :error="!form.image"
        label-class="!text-xl">
        <div class="max-w-full grow">
          <p class="text-k-grey text-sm mb-5">
            Recommended: 400x400px, up to 2MB (JPG, PNG)
          </p>
          <SelectImageField v-model="form.image" :preview="form.imagePreview" />
        </div>
      </NeoField>

      <!-- banner picture -->
      <NeoField
        :label="`Upload Cover Image`"
        :error="!form.banner"
        label-class="!text-xl">
        <div class="max-w-full grow">
          <p class="text-k-grey text-sm mb-5">
            Recommended: 1440x360px (4:1 aspect ratio), up to 10MB (JPG, PNG)
          </p>
          <SelectImageField
            v-model="form.banner"
            :preview="form.bannerPreview" />
        </div>
      </NeoField>

      <!-- socials -->
      <div>
        <p class="font-bold text-xl mb-4">Link socials</p>
        <div class="flex flex-col gap-4">
          <NeoField
            v-for="social in socialLinks"
            :key="social.name"
            class="my-0">
            <div
              class="w-10 h-10 bg-neutral-3 dark:bg-neutral-11 flex justify-center items-center border-y border-l border-k-grey-fix">
              <component :is="social.icon" />
            </div>
            <NeoInput
              v-model="form[social.model]"
              class="!h-10"
              expanded
              :data-testid="social.testId"
              :placeholder="social.placeholder"
              @blur="validatingFormInput(social.model)" />
          </NeoField>
        </div>
      </div>
    </form>
    <NeoButton
      :disabled="submitDisabled"
      variant="k-accent"
      label="Finish Customization"
      size="large"
      no-shadow
      data-testid="create-profile-submit-button"
      @click="emit('submit', form)" />
  </div>
</template>

<script setup lang="ts">
import { formatAddress } from '@/utils/account'
import { NeoButton, NeoField, NeoIcon, NeoInput } from '@kodadot1/brick'
import { ProfileFormData } from '.'
import SelectImageField from '../SelectImageField.vue'
import { Profile } from '@/services/profile'
import { addHttpToUrl } from '@/utils/url'
import { StatusAPIResponse } from '@farcaster/auth-client'

const { accountId } = useAuth()

const props = defineProps<{
  farcasterUserData?: StatusAPIResponse
  useFarcaster: boolean
}>()

const profile = inject<{ userProfile: Ref<Profile>; hasProfile: Ref<boolean> }>(
  'userProfile',
)
const userProfile = computed(() => profile?.userProfile.value)
const substrateAddress = computed(() => formatAddress(accountId.value, 42))

const FarcasterIcon = defineAsyncComponent(
  () => import('@/assets/icons/farcaster-icon.svg?component'),
)

const missingImage = computed(() => (form.imagePreview ? false : !form.image))

const submitDisabled = computed(
  () => !form.name || !form.description || missingImage.value,
)

const emit = defineEmits<{
  (e: 'submit', value: ProfileFormData): void
}>()

const validatingFormInput = (model: string) => {
  switch (model) {
    case 'farcasterHandle':
      if (form.farcasterHandle?.startsWith('/')) {
        form.farcasterHandle = form.farcasterHandle.slice(1)
      }
      break
    case 'website':
      if (form.website && !/^https?:\/\//i.test(form.website)) {
        form.website = addHttpToUrl(form.website)
      }
      break
  }
}

// form state
const form = reactive<ProfileFormData>({
  address: substrateAddress.value,
  name: '',
  description: '',
  image: null,
  imagePreview: undefined,
  banner: null,
  bannerPreview: undefined,
  farcasterHandle: undefined,
  twitterHandle: undefined,
  website: undefined,
})

const socialLinks = [
  {
    name: 'farcaster',
    icon: FarcasterIcon,
    model: 'farcasterHandle',
    placeholder: 'Farcaster Handle',
    testId: 'create-profile-input-farcaster-handle',
  },
  {
    name: 'website',
    icon: () => h(NeoIcon, { icon: 'globe', pack: 'fas' }),
    model: 'website',
    placeholder: 'Website',
    testId: 'create-profile-input-website',
  },
  {
    name: 'twitter',
    icon: () => h(NeoIcon, { icon: 'twitter', pack: 'fab' }),
    model: 'twitterHandle',
    placeholder: 'Twitter Handle',
    testId: 'create-profile-input-twitter-handle',
  },
]

watchEffect(async () => {
  const profile = userProfile.value
  const farcasterProfile = props.farcasterUserData

  // Use Farcaster data if useFarcaster is true and data is available, otherwise fallback to profile data
  form.name =
    props.useFarcaster && farcasterProfile
      ? farcasterProfile.displayName ?? ''
      : profile?.name ?? ''
  form.description =
    props.useFarcaster && farcasterProfile
      ? farcasterProfile.bio ?? ''
      : profile?.description ?? ''
  form.imagePreview =
    props.useFarcaster && farcasterProfile
      ? farcasterProfile.pfpUrl
      : profile?.image
  form.bannerPreview = profile?.banner ?? undefined // Banner preview assumed to always come from the profile

  // Conditional for Farcaster handle based on the useFarcaster prop
  form.farcasterHandle =
    props.useFarcaster && farcasterProfile
      ? farcasterProfile.username
      : profile?.socials.find((s) => s.platform === 'Farcaster')?.handle

  // Social handles are fetched from profile regardless of the Farcaster usage
  form.twitterHandle = profile?.socials.find(
    (s) => s.platform === 'Twitter',
  )?.handle
  form.website = profile?.socials.find((s) => s.platform === 'Website')?.handle
})
</script>
