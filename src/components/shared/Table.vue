<template>
  <div>
    <b-table :striped="true" :data="data" :columns="columns"></b-table>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class Table extends Vue {
  @Prop() public data!: any;
  @Prop() public columns!: any;
}
</script>
