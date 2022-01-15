<template>
<div>
  <label><b>Add {{label}}</b></label>
  <b-field class="add-option-wrapper" >
    <b-input placeholder="Name" v-model="text"></b-input>
    <b-input placeholder="wss://kusama-rpc.polkadot.io/" v-model="value" expanded></b-input>
    <p class="control">
      <b-button :disabled="!text || !value" type="is-dark"
        @click="onAddedOption"
        outlined>Add</b-button>
    </p>
  </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Emit, Prop } from 'vue-property-decorator'

@Component
export default class AddOption extends Vue {
  @Prop() public label!: string;
  @Provide() private value = '';
  @Provide() private text = '';
  private toastMessage = 'Address has been added to the list';

  @Emit('add')
  public onAddedOption() {
    const { text, value } = this
    this.toast(this.toastMessage)
    return { text: `${text} (${value})`, value }
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message)
  }
}
</script>

<style scoped>
.add-option-wrapper {
  margin-bottom: 1em;
}
</style>
