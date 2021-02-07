<template>
  <div class="columns">
    <div class="column is-7 is-offset-3">
      <b-tabs v-model="activeTab" destroy-on-hide>
        <b-tab-item v-for="x in components" :key="x" :label="x">
          <component v-bind:is="x"></component>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator';
const Collection = () => import('@/components/rmrk/Create/Create.vue')
const Token = () => import('@/components/rmrk/Create/CreateToken.vue')

const components = { Collection, Token } 

@Component({ components })
export default class Remark extends Vue {
  public activeTab: number = 0;
  public components: string[] = ['Collection', 'Token']
}
</script>
