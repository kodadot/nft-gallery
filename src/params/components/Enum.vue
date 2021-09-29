<template>
  <div class="arguments-wrapper">
    <b-field :label="`${argument.name}: ${argument.type}`">
      <b-select
        v-model="selected"
        :placeholder="`${argument.name}: ${argument.type}`"
        expanded
        :disabled="disabled"
      >
        <option
          v-for="method in argument.sub"
          v-bind:key="method.name"
          :value="method.name"
          >{{ method.name }}
        </option>
      </b-select>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Enum extends Vue {
  @Prop() public argument!: any;
  @Prop({ default: false }) public readonly disabled!: boolean;
  @Prop({ default: null }) public readonly defaultValue!: any;

  private selectedMethod = null;

  public mounted() {
    console.log('ENUM defaultValue', this.defaultValue)

  }

  get selected() {
    return  this.defaultValue || this.selectedMethod
  }

  set selected(value) {
    this.$emit('selected', { [this.argument.name.toString()]: value })
  }
}
</script>

<style scoped>
.arguments-wrapper {
  margin: 1em 0em 0em 1em;
}

@media only screen and (max-width: 425px) {
  .arguments-wrapper {
    margin: 0.5em 0 0 0;
  }
}
</style>
