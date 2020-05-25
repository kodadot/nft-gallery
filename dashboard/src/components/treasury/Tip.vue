<template>
  <ItemCard>
    <div class="column is-3 proposal-adress__overflow">
      <WithLabel label="Beneficiary"><div>{{ tip.who | toString }}</div></WithLabel>
     
    </div>
    <div class="column is-3 proposal-adress__overflow">
      <WithLabel v-if="hasFinderInfo" label="Finder"><div>{{finderInfo[0]}}</div></WithLabel>
      
    </div>
    <div class="column is-2">
      <WithLabel v-if="hasFinderInfo" label="Fee"><Money :value="finderInfo[1]" /></WithLabel>
    </div>
    <div class="column is-3">
      <WithLabel label="Reason"><div>{{reason}}</div></WithLabel>
    </div>
    <div class="column is-1">
      <b-button class="proposal-button__action" is-primary disabled>
        Endorse
      </b-button>
    </div>
  </ItemCard>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ItemCard from '@/components/shared/wrapper/ItemCard.vue'
import Money from '@/components/shared/format/Money.vue'
import WithLabel from '@/components/shared/format/WithLabel.vue'
import Connector from '@vue-polkadot/vue-api';
import { OpenTip } from '@polkadot/types/interfaces';
import { Option, Bytes } from '@polkadot/types';
import { hexToString } from '@polkadot/util';

@Component({
  components: {
    ItemCard,
    Money,
    WithLabel
  }
})
export default class Tip extends Vue {
  @Prop() public hash!: string;
  private tip: any = {}
  private finderInfo: any = []
  private reason: string | null = null;

  public async mounted() {
    console.warn(this.hash);
    
    const { api } = Connector.getInstance()
    const tip = await api.query.treasury.tips(this.hash)
    this.tip = (tip as any).unwrapOr({})
    console.log(this.tip);
    
    this.finderInfo = this.tip.finder.unwrapOr([]);
    console.log(this.finderInfo, 'finderInfo');
    const reasonText = await api.query.treasury.reasons(this.tip.reason)
    this.reason = (reasonText as any).isSome 
    ? hexToString((reasonText as any).unwrap().toHex())
    : null;
  }

  get hasFinderInfo() {
    return this.finderInfo.length 
  }

}
</script>

<style scoped>
.proposal-adress__overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

