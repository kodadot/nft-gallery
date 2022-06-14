<template>
  <div>
    <p class="label">
      {{ $t(label) }}
    </p>
    <p class="subtitle is-size-6">
      <slot v-if="!isLoading">~</slot>
      <b-skeleton :active="isLoading"></b-skeleton>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class LabeledText extends Vue {
  @Prop({ type: String, required: true, default: 'general.label' })
  public label!: string
  @Prop({ type: Boolean, default: false })
  public isLoading!: string
}
</script>
