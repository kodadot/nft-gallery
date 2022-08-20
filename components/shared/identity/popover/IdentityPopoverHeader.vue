<template>
  <div class="columns mb-3">
    <div class="column is-one-quarter">
      <Identicon
        :size="60"
        :theme="'polkadot'"
        :value="address"
        class="popover-image avatar mr-5" />
    </div>
    <div class="column is-three-quarters">
      <p class="has-text-weight-bold is-size-5 mb-1 break-word">
        {{ identity?.display }}
      </p>
      <a
        v-if="identity?.twitter"
        :href="`https://twitter.com/${identity?.twitter}`"
        class="is-flex is-align-items-center mb-2"
        target="_blank"
        rel="noopener noreferrer">
        <b-icon
          pack="fab"
          icon="twitter"
          class="is-flex is-justify-content-space-between" />
        <span>
          {{ identity?.twitter }}
        </span>
      </a>
      <p class="is-size-7 mb-1">
        {{ shortenedAddress }}
        <b-icon
          v-clipboard:copy="identity?.address"
          icon="copy"
          size="is-small"
          class="copy-icon"
          @click.native="toast('Copied to clipboard')"></b-icon>
      </p>
      <p
        v-if="totalCreated"
        class="is-size-7 is-flex is-align-items-center py-3">
        <b-icon icon="clock" size="is-small" />
        <span class="ml-2">Started minting {{ startedMinting }}</span>
      </p>
      <p
        v-if="totalCollected && lastBought"
        class="is-size-7 is-flex is-align-items-center py-3">
        <b-icon icon="clock" size="is-small" />
        <span class="ml-2">Last bought {{ lastBought }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Identicon from '@polkadot/vue-identicon'
import useIdentityStats from './useIdentityStats'

const address = inject('address')
const shortenedAddress = inject('shortenedAddress')
const identity = inject<{ [x: string]: string }>('identity')

const { totalCollected, totalCreated, startedMinting, lastBought } =
  useIdentityStats({
    address,
  })
const { $buefy } = useNuxtApp()

const toast = (message: string) => {
  $buefy.toast.open(message)
}
</script>

<style scoped>
.copy-icon {
  cursor: pointer;
}

.popover-image {
  min-width: 60px;
}

.break-word {
  overflow-wrap: break-word;
}
</style>
