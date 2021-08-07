<template>
  <h2 class="has-text-weight-bold is-size-4">
    {{ categoryTitle }}    🔍
  </h2>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class ResultBar extends Vue {
  @Prop() public category!: string;

  get categoryTitle(): string {
    if (!this.category || this.category == '') {
      return 'Please select category';
    }
    return this.category;
  }
}
</script>