<template>
  <div class="max-md:gap-6 grid grid-cols-1 md:grid-cols-3">
    <NeoButton variant="outlined-rounded" icon-left="arrow-left">
      {{ $t('go back') }}
    </NeoButton>

    <div>
      <h1 class="text-3xl font-bold">{{ $t('settings') }}</h1>

      <hr class="my-8" />

      <div class="flex flex-col gap-14">
        <div>
          <p class="font-bold mb-6">{{ $t('party.partykit') }}</p>
          <div class="flex items-center">
            <NeoSwitch v-model="partyMode" size="is-medium">
              {{ $t('party.partyMode') }}
              <NeoTooltip multiline :label="$t('party.settingsTooltip')">
                <NeoIcon icon="circle-info" class="!text-k-grey" />
              </NeoTooltip>
            </NeoSwitch>
          </div>
        </div>

        <div>
          <p class="font-bold mb-6">{{ $t('mintingSettings') }}</p>
          <div class="flex items-center">
            <NeoSwitch v-model="hasSupport" size="is-medium">
              {{ $t('preferences.helpCoverCosts') }}
              <NeoTooltip multiline :label="$t('support.tooltip')">
                <NeoIcon icon="circle-info" class="!text-k-grey" />
              </NeoTooltip>
            </NeoSwitch>
          </div>
        </div>

        <div>
          <p class="font-bold mb-6">{{ $t('preferences.userData') }}</p>
          <NeoButton no-shadow icon="wrench" @click="openModal">{{
            $t('profileMenu.configureCookies')
          }}</NeoButton>
        </div>
      </div>
    </div>

    <div />
  </div>
</template>
<script lang="ts" setup>
import { NeoButton, NeoIcon, NeoSwitch, NeoTooltip } from '@kodadot1/brick'

const { openModal } = useCookies()

const preferencesStore = usePreferencesStore()
const { hasSupport } = storeToRefs(preferencesStore)

const partyMode = computed({
  get: () => preferencesStore.getIsPartyMode,
  set: (value) => preferencesStore.setPartyMode(value),
})
</script>
