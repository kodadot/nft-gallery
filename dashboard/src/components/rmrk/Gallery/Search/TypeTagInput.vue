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
    >
    </b-taginput>
  </b-field>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';

@Component({})
export default class extends Vue {
  private tags: string[] = []
  private allTags: string[] = [
    'audio',
    'video',
    'image',
    'gif',
    'svg'
  ];
  @Prop() public value!: any;

  @Emit('input')
  handleInput(value: string[]) {
    return value.join('|')
  }
}
</script>
