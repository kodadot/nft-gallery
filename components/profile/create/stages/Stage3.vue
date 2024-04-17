<template>
  <div class="flex flex-col gap-10">
    <div>
      <span class="mb-3">Setting your profile for</span>
      <CollectionDropCreatedBy :address="substrateAddress" />
    </div>
    <form class="flex flex-col gap-10" @submit.prevent="() => {}">
      <!-- name -->
      <NeoField :label="`Your Name`" required :error="!form.name">
        <NeoInput
          v-model="form.name"
          data-testid="create-profile-input-name"
          required
          :placeholder="'Enter Your Name'" />
      </NeoField>

      <!-- bio -->
      <NeoField :label="`Short Bio`" required :error="!form.description">
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
      <NeoField :label="`Upload profile picture`" required :error="!form.image">
        <div>
          <p class="text-k-grey text-sm">
            Recommended: 400x400px, up to 2MB (JPG, PNG)
          </p>
          <DropUpload
            v-model="form.image"
            required
            expanded
            preview
            accept="image/*"
            :label="'Click to select a file'" />
        </div>
      </NeoField>

      <!-- banner picture -->
      <NeoField :label="`Upload Cover Image`" required :error="!form.banner">
        <div>
          <p class="text-k-grey text-sm">
            Recommended: 1440x360px (4:1 aspect ratio), up to 10MB (JPG, PNG)
          </p>
          <DropUpload
            v-model="form.banner"
            required
            expanded
            accept="image/*"
            :label="'Click to select a file'" />
        </div>
      </NeoField>

      <!-- socials -->
      <div>
        <p class="font-bold text-xl mb-4">Link socials</p>
        <NeoField>
          <NeoInput
            v-model="form.farcasterHandle"
            data-testid="create-profile-input-farcaster-handle"
            :placeholder="'Farcaster Handle'" />
        </NeoField>
        <NeoField>
          <NeoInput
            v-model="form.website"
            data-testid="create-profile-input-website"
            :placeholder="'Website'" />
        </NeoField>
        <NeoField>
          <NeoInput
            v-model="form.twitterHandle"
            data-testid="create-profile-input-x-handle"
            :placeholder="'X Handle'" />
        </NeoField>
      </div>
    </form>
    <NeoButton @click="emit('submit', form)">Create Profile</NeoButton>
  </div>
</template>

<script setup lang="ts">
import { formatAddress } from '@/utils/account'
import { NeoButton, NeoField, NeoInput } from '@kodadot1/brick'
import { ProfileFormData } from '.'
const { accountId } = useAuth()
const substrateAddress = computed(() => formatAddress(accountId.value, 42))

const emit = defineEmits<{
  (e: 'submit', value: ProfileFormData): void
}>()

// form state
const form = reactive<ProfileFormData>({
  address: substrateAddress.value,
  name: '',
  description: '',
  image: null,
  banner: null,
  farcasterHandle: null,
  twitterHandle: null,
  website: null,
})
</script>
