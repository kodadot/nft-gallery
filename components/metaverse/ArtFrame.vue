<template>
  <div>


  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class ArtFrame extends Vue {
  @Prop() public position!: any;
  @Prop() public rotation!: any;
  @Prop() public src!: string;
}
</script>
