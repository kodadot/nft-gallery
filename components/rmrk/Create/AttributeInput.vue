<template>
  <b-field grouped>
    <p class="control">
      <b-button size="is-medium" icon-left="times" @click="remove" />
    </p>
    <b-field label="Type" expanded>
      <b-input
        v-model="vKey"
        placeholder="Background"
        expanded
        spellcheck="true"
      />
    </b-field>
    <b-field label="Name" expanded>
      <b-input v-model="vValue" placeholder="Dark" expanded spellcheck="true" />
    </b-field>
  </b-field>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop, Emit } from 'nuxt-property-decorator';

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
