<template>
  <div class="popover-header pb-2">
    <h6 class="popover-user-heading">{{ $t('user') }}</h6>
    <div class="is-flex is-align-items-center is-justify-content-space-between">
      <div class="is-flex is-align-items-center">
        <nuxt-link
          class="is-size-6 break-word mr-2"
          :to="`/${urlPrefix}/u/${address}`">
          <span data-cy="identity-display">
            {{ identity?.display || shortenedAddress }}</span
          >
        </nuxt-link>
        <b-icon
          v-clipboard:copy="address"
          icon="copy"
          size="is-small"
          class="copy-icon"
          data-cy="identity-clipboard"
          @click.native="toast('Copied to clipboard')"></b-icon>
      </div>
      <a
        v-if="identity?.twitter"
        :href="`https://twitter.com/${identity?.twitter}`"
        target="_blank"
        rel="noopener noreferrer"
        data-cy="identity-twitter">
        <b-icon pack="fab" icon="twitter" />
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useIdentityStats from '../utils/useIdentityStats'

const address = inject('address')
const shortenedAddress = inject('shortenedAddress')

const identity = inject<{ [x: string]: string }>('identity')
const { urlPrefix } = usePrefix()
const { $buefy } = useNuxtApp()

const toast = (message: string) => {
  $buefy.toast.open(message)
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.copy-icon {
  cursor: pointer;
  color: $k-blue;
}

.popover-image {
  min-width: 60px;
}

.break-word {
  overflow-wrap: break-word;
}

.popover-header {
  border-bottom: 1px solid $k-grey;
  .popover-user-heading {
    font-size: 12px;
    color: $k-grey;
  }

  a {
    color: $k-blue !important;
    &:hover {
      color: $k-blue !important;
    }
  }
}
</style>
