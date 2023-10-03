<template>
  <div
    class="rounded border border-k-shade is-flex is-justify-content-start is-flex-grow-1 pl-3">
    <IdentityItem
      v-if="isLogIn"
      :label="$t('confirmPurchase.connectedWith')"
      hide-identity-popover
      disable-identity-link
      :prefix="urlPrefix"
      :account="accountId"
      class="identity-name-font-weight-regular"
      data-testid="item-creator" />
  </div>
</template>

<script setup lang="ts">
import IdentityItem from '@/components/identity/IdentityItem.vue'

const { isLogIn, accountId } = useAuth()
const { urlPrefix } = usePrefix()
</script>
<style scoped>
.rounded {
  border-radius: 10rem;
}
</style>
