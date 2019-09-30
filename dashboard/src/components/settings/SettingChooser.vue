<template>
  <b-field :label="label">
    <b-select
    :placeholder="label"
    v-model="selected"
    expanded
    >
      <option
        v-for="option in options"
        :value="option.value"
        :key="option.value"
      >{{ option.text }}</option>
    </b-select>
  </b-field>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SettingChooser extends Vue {
  @Prop() public label!: string;
  @Prop() public selector!: string;
  @Prop() public setter!: string;
  @Prop() public defaultValue!: string;

  get options() {
      return this.$store.getters[this.selector];
  }

  get selected() {
    return this.$store.getters.getSettings[this.defaultValue]
  }

  set selected(value) {
    this.$store.dispatch(this.setter, value)
  }

}
</script>