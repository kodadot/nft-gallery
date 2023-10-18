<template>
  <div>
    <nuxt-link to="/migrate">
      <NeoButton variant="pill">
        <NeoIcon icon="arrow-left" class="mr-2" />
        Migration Homepage
      </NeoButton>
    </nuxt-link>

    <div class="mt-8 is-centered columns">
      <div class="is-4 column">
        <h1 class="is-size-4 has-text-weight-bold">
          <span class="has-text-grey">Review -</span> Sign
        </h1>

        <hr />

        <div
          class="rounded shade-border-color is-flex is-justify-content-start is-flex-grow-1 pl-3">
          <IdentityItem
            :label="$t('confirmPurchase.connectedWith')"
            hide-identity-popover
            disable-identity-link
            :prefix="urlPrefix"
            :account="accountId"
            class="identity-name-font-weight-regular"
            data-testid="item-creator" />
        </div>

        <div class="mt-5">
          Based on your item count, you may need to sign multiple transactions
          for the migration. Please stay on this page until all signatures fully
          process to lock in the migration.
        </div>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import IdentityItem from '@/components/identity/IdentityItem.vue'

const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const route = useRoute()

definePageMeta({
  layout: 'no-footer',
})

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

.rounded {
  border-radius: 10rem;
}

.shade-border-color {
  @include ktheme() {
    border: 1px solid theme('k-shade');
  }
}

.btn-submit {
  height: 3.5rem;
}
</style>
