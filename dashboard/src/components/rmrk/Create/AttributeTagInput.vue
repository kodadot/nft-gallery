<template>
  <b-field :label="$i18n.t('Name')">
    <b-taginput
      v-model="tags"
      @input="handleInput"
      :data="allTags"
      ellipsis
      icon="tag"
      placeholder="Select tags and create your onw"
      aria-close-label="Delete this tag"
      autocomplete
      open-on-focus
      allow-new
    >
      <template #header>
        <b>Type and press enter to add your own</b>
      </template>
    </b-taginput>
  </b-field>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { Attribute } from '../service/scheme';

const valueOf = ({value}: Attribute) => String(value)

@Component({})
export default class extends Vue {
  private allTags: string[] = [
    'audio',
    'video',
    'image',
    'music',
    'abstract'
  ];
  @Prop() public value!: Attribute[];

  get tags() {
    return this.value ? this.value.map(valueOf) : []
  }

  set tags(value: string[]) {
    this.handleInput(value)
  }

  @Emit('input')
  handleInput(value: string[]) {
    return value.map(v => ({ value: v }))
  }
}
</script>
