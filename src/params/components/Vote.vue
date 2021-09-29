<template>
  <div class="executor-select">
    <b-field :label="`${argument.name}: ${argument.type}`">
      <b-select
        v-model="selected"
        :placeholder="`${argument.name}: ${argument.type}`"
        expanded
      >
        <option
          v-for="option in options"
          v-bind:key="option.text"
          :value="option.value"
          >{{ option.text }}
        </option>
      </b-select>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Vote extends Vue {

  get selected() {
    return ''
  }

  set selected(value: any) {
    this.$emit('selected', { [this.argument.name.toString()]: value })
  }

  @Prop() public argument!: any;
  private options: any[] = [
    { text: 'Nay', value: 0 },
    { text: 'Aye', value: -1 },
  ];

}
</script>
