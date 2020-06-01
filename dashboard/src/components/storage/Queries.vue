<template>
  <div>
    <Query v-for="(value, index) in values" :key="index" :value="value" />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import Query from './Query.vue'

const components = { Query }

@Component({ components })
export default class Queries extends Vue {
  @Prop() public values!: any[];

}
</script>
