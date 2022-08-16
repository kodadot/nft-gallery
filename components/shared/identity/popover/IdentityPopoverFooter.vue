<template>
  <div style="" class="popover-stats-container pt-3">
    <div class="has-text-centered">
      <p class="has-text-weight-bold is-size-6">{{ totalCollected }}</p>
      <span class="is-size-7 is-uppercase">{{ $t('profile.collected') }}</span>
    </div>
    <div class="has-text-centered">
      <p class="has-text-weight-bold is-size-6">{{ totalCreated }}</p>
      <span class="is-size-7 is-uppercase">{{ $t('profile.created') }}</span>
    </div>
    <div class="has-text-centered">
      <p class="has-text-weight-bold is-size-6">{{ totalSold }}</p>
      <span class="is-size-7 is-uppercase">{{ $t('profile.sold') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class IdentityPopoverFooter extends Vue {
  @Prop({ required: true, default: 0 }) readonly totalCollected
  @Prop({ required: true, default: 0 }) readonly totalCreated
  @Prop({ required: true, default: 0 }) readonly totalSold
}
</script>

<style scoped>
.popover-stats-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
</style>
