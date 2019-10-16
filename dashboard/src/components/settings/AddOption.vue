<template>
<div>
  <label><b>Add {{label}}</b></label>
  <b-field class="add-option-wrapper">
    <b-input placeholder="Text" v-model="text"></b-input>
    <b-input placeholder="Value" v-model="value"></b-input>
    <p class="control">
      <button :disabled="!text || !value" class="button is-primary" @click="onAddedOption">Add</button>
    </p>
  </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Emit, Prop } from "vue-property-decorator";

@Component
export default class AddOption extends Vue {
  @Provide()
  private value: string = "";
  @Provide()
  private text: string = "";
  @Prop() public label!: string;

  @Emit("add")
  public onAddedOption() {
    const { text, value } = this;
    console.log("here");

    return { text, value };
  }
}
</script>

<style scoped>
.add-option-wrapper {
  margin-bottom: 1em;
}
</style>