<template>
  <CollapseWrapper
    :visible="visible"
    :hidden="hidden"
  >
    <b-button
      type="is-light"
      outlined
      class="mt-2"
      :disabled="disabled"
      @click="addAttribute"
      icon-left="plus"
      >Add Attribute</b-button
    >
    <div
      v-for="(attribute, index) in attributes"
      :key="index"
      class="custom-attribute-input mt-4 mb-4"
    >
      <AttributeInput
        v-bind.sync="attributes[index]"
        :index="index"
        @remove="removeAttribute"
      />
    </div>
  </CollapseWrapper>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'nuxt-property-decorator'
import { Attribute } from '../service/scheme'

const components = {
  AttributeInput: () => import('./AttributeInput.vue'),
  CollapseWrapper: () => import('@/components/shared/collapse/CollapseWrapper.vue')
}

@Component({ components })
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) max!: number
  @Prop({ type: String, default: 'collapse.collection.attributes.show' }) visible!: string
  @Prop({ type: String, default: 'collapse.collection.attributes.hide' }) hidden!: string
  protected attributes: Attribute[] = []

  addAttribute(): void {
    if (!this.max || (this.max && this.attributes.length < this.max)) {
      this.attributes.push({
        value: '',
        trait_type: ''
      })
    }
  }

  get disabled(): boolean {
    return this.max > 0 && this.attributes.length === this.max
  }

  removeAttribute(index: number): void {
    this.attributes.splice(index, 1)
  }

  @Watch('attributes', { deep: true })
  onAttributesChange(attributes: Attribute[]): void {
    this.handleInput(attributes)
  }

  @Emit('input')
  handleInput(attributes: Attribute[]): Attribute[] {
    return attributes
  }
}
</script>

<style scoped>
  .attribute-label {
    font-size: calc(1rem * 0.75);
  }

  .collapse-icon {
    vertical-align: sub;
  }
</style>
