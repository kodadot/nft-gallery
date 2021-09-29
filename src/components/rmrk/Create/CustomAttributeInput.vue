<template>
  <div>
    <label class="label attribute-label">attributes</label>
    <b-collapse :open="false" aria-id="contentIdForA11y1">
      <template #trigger="props">
        <a aria-controls="contentIdForA11y1" class="mb-2">
          <b-icon class="collapse-icon" :icon="!props.open ? 'eye' : 'eye-slash'"></b-icon>
          <span class="pl-1">{{ !props.open ? "Show" : "Hide" }}</span>
        </a>
      </template>
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
    </b-collapse>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator'
import { Attribute } from '../service/scheme'

const components = {
	AttributeInput: () => import('./AttributeInput.vue')
}

@Component({ components })
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) max!: number;
  protected attributes: Attribute[] = [];

  addAttribute() {
  	if (!this.max || (this.max && this.attributes.length < this.max)) {
  		this.attributes.push({
  			value: '',
  			trait_type: ''
  		})
  	}
  }

  get disabled() {
  	return this.max > 0 && this.attributes.length === this.max
  }

  removeAttribute(index: number) {
  	this.attributes.splice(index, 1)
  }

  @Watch('attributes', { deep: true })
  onAttributesChange(attributes: Attribute[]) {
  	this.handleInput(attributes)
  }

  @Emit('input')
  handleInput(attributes: Attribute[]) {
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
