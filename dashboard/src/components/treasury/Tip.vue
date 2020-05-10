<template>
  <div>
    My Hash is {{ hash }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Tip extends Vue {
  @Prop() public hash!: string;

}
</script>

