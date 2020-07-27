<template>
  <div>
    {{ validators[0] }}
    {{ resolved }}
    <!-- <b-table 
      :data="richValidators"
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
    </b-table> -->
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import { hexToNumber, hexToString } from '@polkadot/util';
import { AccountId } from '@polkadot/types/interfaces';

@Component({})
export default class TableOverview extends Vue {
  @Prop() private validators!: AccountId[];

  private resolved: any = '';
  private richValidators: any = '';
  private columns: any = [
    {
      field: 'peerId',
      label: 'peerId',
      visible: true,
      width: '10',
    }
  ]
  

  private async getAddressInsight(address: any) {
    const stakerInfo = await this.getStakerInfo(address)
    const accountInfo = await this.getAccountsInfo(address)
    return { stakerInfo, accountInfo }
  }

  private async getStakerInfo(address: string) {
    const { api } = Connector.getInstance();
    const query = await api.derive.staking.query(address);
    // const totalHex = query.exposure.total.unwrap()
    // console.log('TableOverview -> getStakerInfo -> query.exposure.total', query.exposure.total.unwrap());
    // console.log('TableOverview -> getStakerInfo -> totalHex', totalHex);
    return { query }
  }

  private async getAccountsInfo(address: string) {
    const { api } = Connector.getInstance();
    return await api.derive.accounts.info(address);
  }

  private async mounted() {
    this.resolved = await this.getAddressInsight(this.validators[0])
  }
}
</script>
