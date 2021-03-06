<template>
  <b-field :label="label">
    <b-select :placeholder="description" v-model="selected">
      <option v-for="option in options" :value="option.value" :key="option.value">
        {{ option.text }}
      </option>
    </b-select>
  </b-field>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class OptionDropdown extends Vue {

	get selected() {
		return this.selectedOption;
	}

	set selected(value: any) {
		this.selectedOption = value;
		this.$emit('selected', value);
	}

	@Prop() public label!: string;
	@Prop() public description!: string;
	@Prop() public options!: any[];
	private selectedOption: any;

}
</script>
