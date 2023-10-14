<template>
  <div>
    <div class="is-flex is-justify-content-space-between">
      <div>
        <div v-if="accountId" class="is-flex is-align-items-center">
          <p class="mr-4">Showing Results For:</p>
          <Avatar :value="accountId" :size="26" class="mr-2" />
          <div>
            <Identity :address="accountId" hide-identity-popover />
          </div>
          <p class="ml-4">On RMRK2</p>
        </div>
        <div v-else class="is-flex is-align-items-center">
          <p class="mr-4">
            To view and migrate assets, please connect your wallet.
          </p>
          <ConnectWalletButton no-shadow variant="k-accent" />
        </div>
      </div>

      <div class="is-flex is-align-items-center question">
        <NeoTooltip
          multiline
          multiline-width="16rem"
          label="Can't find your collection in the list? Make sure you're connected to the correct account/address that owns the collection.">
          <NeoIcon icon="circle-question" class="mr-2" />
        </NeoTooltip>
        <p>Don't See Your Collection?</p>
      </div>
    </div>

    <hr />

    <!-- empty state collection here -->
    <div class="has-text-centered">
      <p class="is-size-4 has-text-weight-bold">Nothing to Migrate</p>
      <p>
        It looks like you have no collections or items ready for migration at
        this time.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoTooltip } from '@kodadot1/brick'
import Identity from '@/components/identity/IdentityIndex.vue'

const { accountId } = useAuth()
</script>

<style lang="scss" scoped>
.question {
  color: grey;
  font-size: 12px;
}
</style>
