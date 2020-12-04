<template>
   <b-tabs v-model="activeTab" destroy-on-hide>
      <b-tab-item v-for="x in components" :key="x" :label="x">
        <component v-bind:is="x"></component>
        </b-tab-item>
    </b-tabs>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
const Treasury = () => import('./Treasury.vue')
const Tips = () => import('./Tips.vue')

@Component({
  components: {
    Treasury,
    Tips
  }
})
export default class TreasuryWrapper extends Vue {
  public activeTab: number = 0;

  public components: string[] = ['Treasury', 'Tips']
}
</script>
