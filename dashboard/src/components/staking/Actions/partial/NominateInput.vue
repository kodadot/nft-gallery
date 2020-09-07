<template>
  <div>
    <b-field :label="label">
      <b-select class='nominate-input__select' multiple native-size="4" v-model="selected">
        <option class="nominate-input__option" v-for="option in options" :value="option" :key="option">
          {{ option | shortAddress(10, -10) }}
        </option>
      </b-select>
    </b-field>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class NominateInput extends Vue {
  @Prop(String) public label!: string;
  @Prop() public options!: any[];
  private selectedOption: any[] = [];

  get selected() {
    return this.selectedOption;
  }

  set selected(_selected: any[]) {
    this.selectedOption = _selected;
    this.$emit('input', _selected);
  }
}
</script>

<style>
   span.select.is-multiple select {
     width: 25em !important;
     height: 5em !important;
   }

</style>
