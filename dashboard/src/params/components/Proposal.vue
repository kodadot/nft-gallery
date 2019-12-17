<template>
  <div>Proposal does not work yet 😢😭</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Proposal extends Vue {
  @Prop() public argument!: any;


}
</script>
