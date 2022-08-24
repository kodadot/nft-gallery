<template>
  <v-tippy
    class="tippy-container"
    interactive
    :animate-fill="false"
    :placement="placement"
    :delay="delay">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <div class="popover-content-container p-4 ms-dos-shadow">
      <slot name="content" />
    </div>
  </v-tippy>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class BasicPopup extends Vue {
  @Prop({ default: () => [100, 800] }) delay?: [number, number]
  @Prop({ type: String, default: 'bottom' }) placement?: string
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.tippy-container {
  width: 100%;
  display: inline-block;
}

.popover-content-container {
  border: 2px solid $primary;
  max-width: 350px;
}

.break-word {
  overflow-wrap: break-word;
}

.ms-dos-shadow {
  box-shadow: $dropdown-content-shadow;
}
</style>
