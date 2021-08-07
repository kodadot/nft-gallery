<template>
  <h2 class="has-text-weight-bold is-size-4">
    {{ category }}  🔍
  </h2>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class ResultBar extends Vue {
  @Prop() public category!: string;
}
</script>