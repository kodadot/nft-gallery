<template>
  <div>
    <div class="label">
      {{ $t('Minting Settings') }}
    </div>
    <b-field>
      <Support v-model="hasSupport" :showPrice="false">
        <template v-slot:tooltip>
          <Tooltip
            :label="$t('support.tooltip')"
            iconsize="is-small"
            buttonsize="is-small"
            tooltipsize="is-medium" />
        </template>
      </Support>
    </b-field>
    <b-field>
      <Support
        v-model="hasCarbonOffset"
        :price="1"
        :activeMessage="$t('carbonOffset.carbonOffsetYes')"
        :passiveMessage="$t('carbonOffset.carbonOffsetNo')">
        <template v-slot:tooltip>
          <Tooltip
            iconsize="is-small"
            buttonsize="is-small"
            tooltipsize="is-large">
            <template v-slot:content>
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
    </b-field>
    <ArweaveUploadSwitch v-model="arweaveUpload">
      <template v-slot:tooltip>
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

@Component({
  components: {
    ArweaveUploadSwitch: () =>
      import('@/components/rmrk/Create/ArweaveUploadSwitch.vue'),
    Support: () => import('@/components/shared/Support.vue'),
    Tooltip: () => import('@/components/shared/Tooltip.vue'),
  },
})
export default class Minting extends Vue {
  get hasSupport(): boolean {
    return this.$store.state.preferences.hasSupport
  }

  set hasSupport(value: boolean) {
    this.$store.dispatch('preferences/setHasSupport', value)
  }

  get hasCarbonOffset(): boolean {
    return this.$store.state.preferences.hasCarbonOffset
  }

  set hasCarbonOffset(value: boolean) {
    this.$store.dispatch('preferences/setHasCarbonOffset', value)
  }

  get arweaveUpload(): boolean {
    return this.$store.state.preferences.arweaveUpload
  }

  set arweaveUpload(value: boolean) {
    this.$store.dispatch('preferences/setArweaveUpload', value)
  }
}
</script>
