<template>
  <div>
    <div class="label">
      {{ $t('Minting Settings') }}
    </div>
    <NeoField>
      <Support v-model="hasSupport" :show-price="false">
        <template #tooltip>
          <Tooltip
            :label="$t('support.tooltip')"
            iconsize="is-small"
            buttonsize="is-small"
            tooltipsize="is-medium" />
        </template>
      </Support>
    </NeoField>
    <NeoField>
      <Support
        v-model="hasCarbonOffset"
        :price="1"
        :active-message="$t('carbonOffset.carbonOffsetYes')"
        :passive-message="$t('carbonOffset.carbonOffsetNo')">
        <template #tooltip>
          <Tooltip
            iconsize="is-small"
            buttonsize="is-small"
            tooltipsize="is-large">
            <template #content>
              {{ $t('carbonOffset.tooltip') }}
              (<a
                class="has-text-black is-underlined"
                href="https://kodadot.xyz/carbonless"
                >https://kodadot.xyz/carbonless</a
              >)
            </template>
          </Tooltip>
        </template>
      </Support>
    </NeoField>
    <ArweaveUploadSwitch v-model="arweaveUpload">
      <template #tooltip>
        <Tooltip
          :label="$t('arweave.tooltip')"
          iconsize="is-small"
          buttonsize="is-small"
          tooltipsize="is-medium" />
      </template>
    </ArweaveUploadSwitch>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { usePreferencesStore } from '@/stores/preferences'
import { NeoField } from '@kodadot1/brick'

@Component({
  components: {
    ArweaveUploadSwitch: () =>
      import('@/components/rmrk/Create/ArweaveUploadSwitch.vue'),
    Support: () => import('@/components/shared/Support.vue'),
    Tooltip: () => import('@/components/shared/Tooltip.vue'),
    NeoField,
  },
})
export default class Minting extends Vue {
  private preferencesStore = usePreferencesStore()

  get hasSupport(): boolean {
    return this.preferencesStore.hasSupport
  }

  set hasSupport(value: boolean) {
    this.preferencesStore.setHasSupport(value)
  }

  get hasCarbonOffset() {
    return this.preferencesStore.getHasCarbonOffset
  }

  set hasCarbonOffset(value: boolean) {
    this.preferencesStore.setHasCarbonOffset(value)
  }

  get arweaveUpload(): boolean {
    return this.preferencesStore.arweaveUpload
  }

  set arweaveUpload(value: boolean) {
    this.preferencesStore.setArweaveUpload(value)
  }
}
</script>
