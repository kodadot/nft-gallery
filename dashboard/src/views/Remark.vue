<template>
  <div>
    <h2 class="nft-gallery__title">RMRK.app NFT Reader</h2>
    <Reader />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Reader from '@/components/rmrk/Reader/Reader.vue'

const components = { Reader } 

@Component({ components })
export default class Remark extends Vue {

  private value2: any;
  @Prop() public value!: any;
}
</script>

<style scoped>
.nft-gallery__title {
  font-size: 2em;
  font-weight: 500;
}

</style>
