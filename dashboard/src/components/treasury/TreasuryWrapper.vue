<template>
   <b-tabs v-model="activeTab">
      <b-tab-item v-for="x in components" :key="x" :label="x">
        <component v-bind:is="x"></component>
        </b-tab-item>
    </b-tabs>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Treasury from './Treasury.vue'
import Tips from './Tips.vue'

@Component({
  components: {
    Treasury
  }
})
export default class TreasuryWrapper extends Vue {
  public activeTab: number = 0;

  public components: string[] = ['Treasury', 'Tips']
}
</script>
