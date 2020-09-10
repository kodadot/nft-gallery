<template>
  <ItemCard>
    <div class="column is-3">
      <WithLabel label="Beneficiary"><div class="proposal-tip__reason">{{ tip.who | toString }}</div></WithLabel>
     
    </div>
    <div class="column is-3">
      <WithLabel label="Finder"><div class="proposal-tip__reason">{{ tip.finder | toString }}</div></WithLabel>
      
    </div>
    <div class="column is-1">
      <WithLabel label="Fee"><Money :value="tip.deposit" /></WithLabel>
    </div>
    <div class="column is-3">
      <WithLabel label="Reason"><div class="proposal-tip__reason">{{ reason | toString }}</div></WithLabel>
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
    
    const reasonText = await api.query.treasury.reasons(this.tip.reason)
    this.reason = (reasonText as any).isSome 
    ? hexToString((reasonText as any).unwrap().toHex())
    : null;
  }


}
</script>

<style scoped>

.proposal-tip__reason {
  word-break: break-word;
}
</style>

