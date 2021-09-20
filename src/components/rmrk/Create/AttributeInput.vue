<template>
  <b-field grouped>
    <p class="control">
      <b-button size="is-medium" @click="remove" icon-left="times" />
    </p>
    <b-field label="Type" expanded>
      <b-input
        placeholder="Background"
        v-model="vKey"
        expanded
        spellcheck="true"
      ></b-input>
    </b-field>
    <b-field label="Name" expanded>
      <b-input
        placeholder="Dark"
        v-model="vValue"
        expanded
        spellcheck="true"
      ></b-input>
    </b-field>
  </b-field>
</template>

<script lang="ts" >
import { Component, Vue, PropSync, Prop, Emit } from 'vue-property-decorator';

@Component
export default class AttributeInput extends Vue {
  @Prop(Number) index!: number;
  @PropSync('trait_type', { type: String }) vKey!: string;
  @PropSync('value', { type: String }) vValue!: string;

  @Emit('remove')
  protected remove() {
    return this.index;
  }
}
</script>
