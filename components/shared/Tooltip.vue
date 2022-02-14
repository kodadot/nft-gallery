<template>
  <p class="control">
    <b-tooltip
      type="is-white"
      :size="tooltipsize"
      position="is-left"
      :label="label"
      multilined
      square
      :triggers="['hover', 'click']">
      <b-button type="is-dark" :size="buttonsize">
        <b-icon :size="iconsize" icon="info" />
      </b-button>
      <template v-slot:content>
        <slot name="content" />
      </template>
    </b-tooltip>
  </p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class Tooltip extends Vue {
  @Prop() public label!: string
  @Prop({ default: 'is-medium' }) public iconsize!: string
  @Prop({ default: 'is-medium' }) public buttonsize!: string
  @Prop({ default: 'is-small' }) public tooltipsize!: string
}
</script>
