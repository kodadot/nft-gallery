<template>
  <div class="content is-hidden-mobile">
    <b-field :position="position">
      <b-tooltip :label="$t('tooltip.largeDisplay')">
        <b-radio-button
          v-model="preferenceLayout"
          type="is-primary"
          class="collection-radio-btn"
          native-value="is-half-desktop is-half-tablet"
          :disabled="disabled"
          data-cy="large-display">
          <span>
            <b-icon icon="th-large" />
          </span>
        </b-radio-button>
      </b-tooltip>
      <b-tooltip :label="$t('tooltip.smallDisplay')">
        <b-radio-button
          v-model="preferenceLayout"
          type="is-primary"
          class="collection-radio-btn"
          native-value="is-one-quarter-desktop is-one-third-tablet"
          :disabled="disabled"
          data-cy="small-display">
          <span>
            <b-icon icon="th" />
          </span>
        </b-radio-button>
      </b-tooltip>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { RmrkType } from '@/components/rmrk/service/scheme'
import { usePreferencesStore } from '@/stores/preferences'

@Component({})
export default class Layout extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string
  @Prop({ default: 'rmrk/detail' }) public link!: string
  @Prop({ type: Boolean, default: false }) public readonly disabled!: boolean
  @Prop({ type: String, default: 'is-right' }) public readonly position!:
    | 'is-left'
    | 'is-right'
  @Prop() public items!: RmrkType[]

  get preferencesStore() {
    return usePreferencesStore()
  }

  get preferenceLayout() {
    return this.preferencesStore.getLayoutClass
  }

  set preferenceLayout(data) {
    this.$emit('change')
    this.preferencesStore.layoutClass = data
  }
}
</script>
