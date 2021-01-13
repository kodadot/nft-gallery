<template>
   <b-tabs v-model="activeTab" destroy-on-hide>
      <b-tab-item v-for="x in components" :key="x" :label="x">
        <component v-bind:is="x"></component>
      </b-tab-item>
    </b-tabs>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
const Reader = () => import('@/components/rmrk/Reader/Reader.vue')
const Create = () => import('@/components/rmrk/Create/Create.vue')
const CreateToken = () => import('@/components/rmrk/Create/CreateToken.vue')

const components = { Create, CreateToken, Reader } 

@Component({ components })
export default class Remark extends Vue {
  public activeTab: number = 0;

  public components: string[] = ['Create', 'CreateToken', 'Reader']
}
</script>

<style scoped>
/* .nft-gallery__title {
  font-size: 2em;
  font-weight: 500;
} */

</style>
