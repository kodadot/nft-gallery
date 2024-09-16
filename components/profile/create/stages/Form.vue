<template>
  <div class="flex flex-col gap-10">
    <div class="flex flex-col gap-3">
      <span>Setting your profile for</span>
      <CollectionDropCreatedBy :address="accountId" />
    </div>
    <form
      class="flex flex-col gap-10"
      @submit.prevent
    >
      <!-- name -->
      <NeoField
        :label="`Your Name`"
        required
        :error="!form.name"
        label-class="!text-xl"
      >
        <NeoInput
          v-model="form.name"
          data-testid="create-profile-input-name"
          required
          :placeholder="'Enter Your Name'"
        />
      </NeoField>

      <!-- bio -->
      <NeoField
        ref="bioField"
        :label="`Short Bio`"
        required
        :error="!form.description"
        label-class="!text-xl"
      >
        <NeoInput
          v-model="form.description"
          data-testid="create-profile-input-bio"
          required
          type="textarea"
          :maxlength="200"
          has-counter
          counter-class="mt-3"
          :placeholder="'introduce yourself in a few words'"
        />
        <template #message>
          <div>
            <p
              v-if="bioMessage"
              class="o-field__message o-field__message-danger"
            >
              {{ bioMessage }}
            </p>
            <div class="flex gap-2 items-center capitalize text-k-grey !pt-2">
              <NeoIcon
                icon="markdown"
                pack="fab"
              />
              <span>{{ $t('markdownSupported') }} </span>
            </div>
          </div>
        </template>
      </NeoField>

      <!-- profile picture -->
      <NeoField
        :label="`Upload profile picture`"
        required
        :error="!form.image"
        label-class="!text-xl"
      >
        <div class="max-w-full grow">
          <p class="text-k-grey text-sm mb-5">
            Recommended: 400x400px, up to 2MB (JPG, PNG)
          </p>
          <SelectImageField
            v-model="form.image"
            :preview="form.imagePreview"
            :max-size-in-mb="2"
            @clear="form.imagePreview = undefined"
          />
        </div>
      </NeoField>

      <!-- banner picture -->
      <NeoField
        :label="`Upload Cover Image`"
        :error="!form.banner"
        label-class="!text-xl"
      >
        <div class="max-w-full grow">
          <p class="text-k-grey text-sm mb-5">
            Recommended: 1440x360px (4:1 aspect ratio), up to 5MB (JPG, PNG)
          </p>
          <SelectImageField
            v-model="form.banner"
            :preview="form.bannerPreview"
            :max-size-in-mb="5"
            @clear="form.bannerPreview = undefined"
          />
        </div>
      </NeoField>

      <!-- socials -->
      <div>
        <p class="font-bold text-xl mb-4">
          Link socials
        </p>
        <div class="flex flex-col gap-4">
          <NeoField
            v-for="social in socialLinks"
            :key="social.name"
            class="my-0"
          >
            <div
              class="w-10 h-10 bg-neutral-3 dark:bg-neutral-11 flex justify-center items-center border-y border-l border-k-grey-fix"
            >
              <component :is="social.icon" />
            </div>
            <NeoInput
              v-model="form[social.model]"
              class="!h-10"
              expanded
              :data-testid="social.testId"
              :placeholder="social.placeholder"
              @blur="validatingFormInput(social.model)"
            />
          </NeoField>
        </div>
      </div>
    </form>
    <div class="flex flex-col gap-6">
      <NeoButton
        :disabled="submitDisabled"
        variant="primary"
        :label="
          signingMessage
            ? $t('drops.signTransaction')
            : $t('profiles.finishCustomization')
        "
        size="large"
        no-shadow
        data-testid="create-profile-submit-button"
        @click="emit('submit', form)"
      />

      <template v-if="userProfile">
        <span
          v-if="isDeleteConfirmSafetyDelay"
          class="capitalize text-k-red text-center"
        >{{ deleteConfirmSafetyDelayText }}
        </span>

        <NeoButton
          v-else
          variant="text"
          no-shadow
          :class="[
            deleteConfirm ? '!text-k-red' : '!text-k-grey',
            'capitalize',
          ]"
          @click="deleteProfile"
        >
          <div class="flex gap-3 justify-center">
            <span>{{ deleteConfirmText }} </span>
            <NeoIcon
              v-if="!deleteConfirm"
              icon="rotate-left"
            />
          </div>
        </NeoButton>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoField, NeoIcon, NeoInput } from '@kodadot1/brick'
import type { StatusAPIResponse } from '@farcaster/auth-client'
import SelectImageField from '../SelectImageField.vue'
import type { ProfileFormData } from '.'
import type { Profile } from '@/services/profile'
import { toSubstrateAddress } from '@/services/profile'
import { addHttpToUrl } from '@/utils/url'

const FarcasterIcon = defineAsyncComponent(
  () => import('@/assets/icons/farcaster-icon.svg?component'),
)

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
    icon: () => h(NeoIcon, { icon: 'x-twitter', pack: 'fab' }),
    model: 'twitterHandle',
    placeholder: 'Twitter Handle',
    testId: 'create-profile-input-twitter-handle',
  },
]

const DELETE_CONFIRM_SAFETY_DELAY = 3000

const emit = defineEmits<{
  (e: 'submit', value: ProfileFormData): void
  (e: 'delete', address: string): void
}>()

const props = defineProps<{
  farcasterUserData?: StatusAPIResponse
  useFarcaster: boolean
  signingMessage: boolean
}>()

const deleteConfirm = ref<Date>()
const bioField = ref()

const now = useNow()
const { $i18n } = useNuxtApp()
const { accountId } = useAuth()
const profile = inject<{ userProfile: Ref<Profile>, hasProfile: Ref<boolean> }>(
  'userProfile',
)

const bioMessage = computed(() => bioField.value?.$data?.newMessage)
const isDeleteConfirmSafetyDelay = computed(() =>
  deleteConfirm.value
    ? now.value.getTime() - deleteConfirm.value.getTime()
    < DELETE_CONFIRM_SAFETY_DELAY
    : false,
)

const deleteConfirmSafetyDelayText = computed(() => {
  if (isDeleteConfirmSafetyDelay.value && deleteConfirm.value) {
    return $i18n.t('profiles.waitSeconds', [
      Math.ceil(
        (deleteConfirm.value.getTime()
          + DELETE_CONFIRM_SAFETY_DELAY
          - now.value.getTime())
          / 1000,
      ),
    ])
  }

  return ''
})

const deleteConfirmText = computed(() =>
  !deleteConfirm.value
    ? $i18n.t('profiles.delete')
    : $i18n.t('profiles.deleteConfirm'),
)

const substrateAddress = computed(() => toSubstrateAddress(accountId.value))
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
const userProfile = computed(() => profile?.userProfile.value)
const missingImage = computed(() => (form.imagePreview ? false : !form.image))
const submitDisabled = computed(
  () =>
    !form.name
    || !form.description
    || missingImage.value
    || props.signingMessage,
)

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

const deleteProfile = () => {
  if (deleteConfirm.value) {
    emit('delete', substrateAddress.value)
  }
  else {
    deleteConfirm.value = new Date()
  }
}

watchEffect(async () => {
  const profile = userProfile.value
  const farcasterProfile = props.farcasterUserData
  const useFarcasterData = props.useFarcaster && farcasterProfile
  const getProfileSocial = (platform: string) =>
    profile?.socials.find(s => s.platform === platform)

  // Use Farcaster data if useFarcaster is true and data is available, otherwise fallback to profile data
  form.name = useFarcasterData
    ? farcasterProfile.displayName ?? ''
    : profile?.name ?? ''
  form.description = useFarcasterData
    ? farcasterProfile.bio ?? ''
    : profile?.description ?? ''
  form.imagePreview = useFarcasterData
    ? farcasterProfile.pfpUrl
    : profile?.image
  form.bannerPreview = profile?.banner ?? undefined // Banner preview assumed to always come from the profile

  // Conditional for Farcaster handle based on the useFarcaster prop
  form.farcasterHandle = useFarcasterData
    ? farcasterProfile.username
    : getProfileSocial('Farcaster')?.handle

  // Social handles are fetched from profile regardless of the Farcaster usage
  form.twitterHandle = getProfileSocial('Twitter')?.handle
  form.website = getProfileSocial('Website')?.handle
})
</script>
