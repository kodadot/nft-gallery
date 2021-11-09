<template>
  <b-field :label="$i18n.t('Tags')">
    <b-taginput
      id="search_tag"
      v-model="tags"
      type="is-grey"
      :data="allTags"
      :maxtags="max"
      ellipsis
      icon="tag"
      :placeholder="placeholder"
      aria-close-label="Delete this tag"
      autocomplete
      open-on-focus
      allow-new
      @input="handleInput"
    >
      <template #header>
        <b>Type and press enter to add your own</b>
      </template>
    </b-taginput>
  </b-field>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Emit } from 'nuxt-property-decorator'
import { Attribute } from '../service/scheme'

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
  @Prop({ default: 3 }) public max!: string | number;
  @Prop({ default: 'Select tags or create your own' }) public placeholder!: string;
  @Prop(Boolean) public simple!: boolean

  get tags() {
    return this.simple ? (this.value || []) as any[] as string[] : (this.value || []).map(valueOf)
  }

  set tags(value: string[]) {
    this.handleInput(value)
  }

  @Emit('input')
  handleInput(value: string[]) {
    return this.simple ? value : value.map(v => ({ value: v }))
  }
}
</script>
