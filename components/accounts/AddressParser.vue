<template>
  <div>
    <p class="title is-6">
      {{ $t('mint.expert.count', [value.length]) }}
    </p>
    <b-field :label="$i18n.t('mint.expert.batchSend')">
      <b-input
        @input="handleInput"
        type="textarea"
        :placeholder="'Distribute NFTs to multiple addresses like this:\n- HjshJ....3aJk\n- FswhJ....3aVC\n- HjW3J....9c3V'"
        spellcheck="true"
        custom-class="ap-textarea"></b-input>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { parseBatchAddresses } from './utils'

@Component({})
export default class AddressParser extends Vue {
  @Prop({ type: Array, default: () => [], required: true }) value!: string[]

  @Emit('input')
  handleInput(event: string): string[] {
    return parseBatchAddresses(event)
  }
}
</script>

<style lang="scss">
.ap-textarea {
  height: 400px !important;
}
</style>
