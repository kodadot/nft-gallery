<template>
  <div>
    <label
      ><b>Add {{ label }}</b></label
    >
    <NeoField class="add-option-wrapper">
      <NeoInput v-model="text" placeholder="Name" />
      <NeoInput
        v-model="value"
        placeholder="wss://kusama-rpc.polkadot.io/"
        expanded />
      <p class="control">
        <b-button
          :disabled="!text || !value"
          type="is-primary"
          outlined
          @click="onAddedOption">
          Add
        </b-button>
      </p>
    </NeoField>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Provide, Vue } from 'nuxt-property-decorator'
import { NeoField, NeoInput } from '@kodadot1/brick'

@Component({
  components: {
    NeoField,
    NeoInput,
  },
})
export default class AddOption extends Vue {
  @Prop() public label!: string
  @Provide() private value = ''
  @Provide() private text = ''
  private toastMessage = 'Address has been added to the list'

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
