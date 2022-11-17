<template>
  <div class="popover-header pb-2">
    <h6 class="popover-user-heading">{{ $t('user') }}</h6>
    <nuxt-link
      class="is-size-6 mb-1 break-word"
      :to="`/${urlPrefix}/u/${address}`">
      <span data-cy="identity-display">
        {{ identity?.display || shortenedAddress }}</span
      >
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import useIdentityStats from '../utils/useIdentityStats'

const address = inject('address')
const shortenedAddress = inject('shortenedAddress')

const identity = inject<{ [x: string]: string }>('identity')
const { urlPrefix } = usePrefix()
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.copy-icon {
  cursor: pointer;
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
  }
}
</style>
