<template>
  <div>
    <DisabledInput
      label="Best Block" :value="currentBlock.toString()" />
    <DisabledInput
      label="Waiting" :value="`${next.length}`" />
    <DisabledInput
      label="Nominators" :value="nominators" />
    <b-progress v-if="!SummarySessionLoaded"
      size="is-large" type="is-primary" show-value>Fetching data</b-progress>
    <SummarySession :currentBlock="currentBlock" @loadedSession="sessionIsLoaded" />
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
import { Component, Prop, Vue, Watch, PropSync } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import SummarySession from '@/components/explorer/SummarySession.vue'
import DisabledInput from '@/components/shared/DisabledInput.vue';

@Component({
  components: {
    SummarySession,
    DisabledInput,
  }
})
export default class Overview extends Vue {
  private SummarySessionLoaded: boolean = false;
  private currentBlock: any = {};
  private subs: any[] = [];
  private columns: any = [
    {
      field: 'peerId',
      label: 'peerId',
      visible: true,
      width: '10',
    },
    {
      field: 'roles',
      label: 'role',
      width: '10',
      visible: true
    },
    {
      field: 'bestNumber',
      label: 'best block',
      visible: true,
    },
    {
      field: 'bestHash',
      label: 'best hash',
      width: '10',
      visible: false
    }
  ]

  @Prop() private next!: any[];
  @Prop({default: '-'}) private nominators: string = '';
  @Prop() private stakingOverview: any;
  @Prop() private validators: any;

  private sessionIsLoaded() {
    this.SummarySessionLoaded = true
  }

  private async mounted() {
    const { api } = Connector.getInstance();
    this.subs.push(await api.derive.chain.bestNumber((value: any) => this.currentBlock = value));
  }

  private beforeDestroy() {
    this.subs.forEach((sub) => sub());
  }
}
</script>
