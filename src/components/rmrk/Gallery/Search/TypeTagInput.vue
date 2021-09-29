<template>
  <b-field>
    <b-taginput
      v-model="tags"
      @input="handleInput"
      :data="allTags"
      ellipsis
      icon="tag"
      placeholder="Search by type"
      aria-close-label="Delete this tag"
      autocomplete
      open-on-focus
      type="is-primary"
    >
    </b-taginput>
  </b-field>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator'

@Component({})
export default class extends Vue {
  private allTags: string[] = [
    'audio',
    'video',
    'image',
    'gif',
    'svg'
  ];
  @Prop() public value!: string;

  get tags() {
    return this.value ? this.value.split('|') : []
  }

  set tags(value: string[]) {
    this.handleInput(value)
  }

  @Emit('input')
  handleInput(value: string[]) {
    return value.join('|')
  }
}
</script>
