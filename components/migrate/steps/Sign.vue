<template>
  <div>
    <div class="mt-5">{{ $t('migrate.signNotes') }}</div>

    <hr />
    <p>
      TODO:
      https://github.com/kodadot/nft-gallery/issues/7562#issuecomment-1765884165
    </p>
    <hr />

    <NeoButton
      label="Sign all required transactions"
      variant="k-accent"
      class="mt-4 btn-submit"
      expanded
      @click="toCongrats()" />
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const route = useRoute()

const toCongrats = () => {
  navigateTo({
    path: '/migrate/congrats',
    query: {
      ...route.query,
    },
  })
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.btn-submit {
  height: 3.5rem;
}
</style>
