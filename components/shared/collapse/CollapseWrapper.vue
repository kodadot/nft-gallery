<template>
  <div>
    <b-collapse
      :open="isOpen"
      :position="position"
      aria-id="contentIdForA11y1"
      :class="{ 'is-unselectable': !isSelectable }"
    >
      <template #trigger="props">
        <a aria-controls="contentIdForA11y1" class="mb-2">
          <b-icon
            class="collapse-icon"
            :icon="!props.open ? 'eye' : 'eye-slash'"
          ></b-icon>
          <span class="pl-1">{{ $t(!props.open ? visible : hidden) }}</span>
        </a>
      </template>
      <slot class="mt-2"></slot>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class CollapseWrapper extends Vue {
  @Prop({ type: String, default: 'Show' }) visible!: string
  @Prop({ type: String, default: 'Hide' }) hidden!: string
  @Prop({ type: Boolean, default: false }) private readonly openOnDefault!: boolean
  @Prop(Boolean) bottom!: boolean
  @Prop({ type: Boolean, default: false }) isSelectable!: boolean

  protected isOpen = this.openOnDefault

  get position(): string {
    return this.bottom ? 'is-bottom' : 'is-top'
  }
}
</script>
