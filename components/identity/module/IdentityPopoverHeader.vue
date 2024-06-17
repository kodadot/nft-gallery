<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <ProfileAvatar :size="68" :address="address" />

      <ProfileFollowButton :target="address" />
    </div>

    <div class="gap-2 flex flex-col">
      <p class="font-bold text-xl">
        {{ identity?.display || shortenedAddress }}
      </p>

      <div class="flex items-center">
        <nuxt-link
          class="text-base break-words mr-2 text-neutral-7 hover:text-text-color"
          :to="`/${urlPrefix}/u/${address}`">
          <span data-testid="identity-display"> {{ shortenedAddress }}</span>
        </nuxt-link>
        <NeoIcon
          v-clipboard:copy="address"
          icon="copy"
          class="hover:text-k-blue-hover cursor-pointer text-neutral-7 hover:text-text-color"
          data-testid="identity-clipboard"
          @click="toast($t('general.copyAddressToClipboard'))" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

const address = inject('address') as string
const shortenedAddress = inject('shortenedAddress') as string

const identity = inject<{ [x: string]: string }>('identity')
const { urlPrefix } = usePrefix()
const { toast } = useToast()
</script>
