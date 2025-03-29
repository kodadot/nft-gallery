<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <nuxt-link :to="`/${urlPrefix}/u/${address}`">
        <ProfileAvatar
          :size="68"
          :address="address"
        />
      </nuxt-link>

      <ProfileFollowButton
        v-if="address !== accountId"
        :target="address"
        @follow:success="$emit('refresh')"
        @unfollow:success="$emit('refresh')"
      />
    </div>

    <div class="gap-2 flex flex-col">
      <nuxt-link
        class="break-words mr-2 font-bold text-xl"
        :to="`/${urlPrefix}/u/${address}`"
      >
        {{ identity?.display || shortenedAddress }}
      </nuxt-link>

      <div class="flex items-center gap-2">
        <span
          data-testid="identity-display"
          class="text-neutral-7"
        >
          {{ shortenedAddress }}</span>
        <KIcon
          v-clipboard:copy="address"
          name="i-mdi:content-copy"
          class="hover:text-k-blue-hover cursor-pointer text-neutral-7 hover:text-text-color"
          data-testid="identity-clipboard"
          @click="toast($t('general.copyAddressToClipboard'))"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['refresh'])

const address = inject('address') as string
const shortenedAddress = inject('shortenedAddress') as string

const identity = inject<{ [x: string]: string }>('identity')
const { urlPrefix } = usePrefix()
const { toast } = useToast()
const { accountId } = useAuth()
</script>
