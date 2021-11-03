<template>
  <div>
    <b-table
      :striped="true"
      :data="data"
      :columns="columns"
    />
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class Table extends Vue {
  @Prop() public data!: any;
  @Prop() public columns!: any;
}
</script>
