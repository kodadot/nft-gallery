<template>
  <div>
    <b-table 
      :data="validators"
      :striped="true"
      default-sort-direction="desc"
      default-sort="bestNumber">
      <template slot-scope="props">
        <b-table-column v-for="(col, index) in columns"
          :key="index"
          :field="col.field"
          :label="col.label"
          :visible="col.visible"
          sortable>
          {{ props.row[col.field]}}
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';


@Component({})
export default class TableOverview extends Vue {

  private value2: any;
  private columns: any = [
    {
      field: 'peerId',
      label: 'peerId',
      visible: true,
      width: '10',
    }
  ]
  @Prop() private validators!: any;
}
</script>
