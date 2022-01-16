<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class extends Vue {
  private value2: any;
  @Prop() public value!: any;
}
</script>
