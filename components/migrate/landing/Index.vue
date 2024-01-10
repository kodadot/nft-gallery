<template>
  <div class="mt-8">
    <MigrateLandingHeader />
    <hr />
    <div class="flex flex-col md:flex-row gap-4 justify-between">
      <div>
        <div
          v-if="accountId"
          class="flex flex-col md:flex-row gap-4 items-center">
          <p class="mr-4">{{ $t('migrate.resultFor') }}</p>
          <div class="flex">
            <Avatar :value="accountId" :size="26" class="mr-2" />
            <nuxt-link
              class="text-k-blue"
              :to="`/${sourceSelected?.value}/u/${accountId}`">
              <IdentityIndex :address="accountId" hide-identity-popover />
            </nuxt-link>
            <p class="ml-4">{{ sourceSelected?.text }}</p>
          </div>
        </div>
        <div v-else class="flex items-center">
          <p class="mr-4">{{ $t('migrate.connect') }}</p>
          <ConnectWalletButton no-shadow variant="k-accent" />
        </div>
      </div>

      <div class="text-xs text-k-grey text-center">
        <NeoTooltip
          multiline
          multiline-width="16rem"
          :label="$t('migrate.tooltipCollectionLabel')">
          <div class="flex items-center">
            <NeoIcon icon="circle-question" class="mr-2" />
            <p>{{ $t('migrate.tooltipCollection') }}</p>
          </div>
        </NeoTooltip>
      </div>
    </div>

    <hr />
    <MigrateLandingContent :key="sourceSelected?.value" />
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoTooltip } from '@kodadot1/brick'

const { accountId } = useAuth()
const { sourceSelected } = useMigrate()
</script>
