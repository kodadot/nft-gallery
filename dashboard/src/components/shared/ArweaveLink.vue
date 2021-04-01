<template>
  <ExternalLink :url="link" :id="id" class="is-flex">
    <figure class="image is-24x24 icon__less-margin">
      <img :src="require('@/assets/arweave.svg')" />
    </figure>
    <b class="is-align-self-center">View {{ label }} on Arweave</b>
  </ExternalLink>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
const components = {
  ExternalLink: () => import('@/components/shared/format/ExternalLink.vue')
};

@Component({ components })
export default class ArweaveLink extends Vue {
  @Prop() public id!: string;
  @Prop({ default: 'content' }) public label!: string;
  protected link: string = 'https://viewblock.io/arweave/tx/';
}
</script>

<style scoped>
.icon__less-margin {
  margin: 0 0.5rem 1em 0 !important;
}
</style>
