<template>
  <b-field :label="label">
    <b-select
      v-model="selected"
      :placeholder="description"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </b-select>
  </b-field>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class OptionDropdown extends Vue {

  get selected() {
    return this.selectedOption
  }

  set selected(value: any) {
    this.selectedOption = value
    this.$emit('selected', value)
  }

	@Prop() public label!: string
	@Prop() public description!: string
	@Prop() public options!: any[]
	private selectedOption: any

}
</script>
