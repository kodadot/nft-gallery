<template>
  <!-- // TODO denomination and set asset by network -->
  <b-tag class="balance-tag"
    type="is-dark" size="is-medium">
    Transferable:
    <Money :value="currentBalance" inline />
  </b-tag>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Connector from '@vue-polkadot/vue-api'
import Money from '@/components/shared/format/Money.vue'

@Component({
  components: {
    Money
  }
})
export default class Balance extends Vue {
  @Prop() public account!: string;
  private currentBalance = '0';


  @Watch('account')
  public async onAccountChange(value: string) {
    const { api } = Connector.getInstance()
    const { data: balance } = await api.query.system.account(value)
    this.currentBalance = balance.free?.toString()
  }
}
</script>

<style scoped>
  .balance-tag {
    margin-bottom: 0.5em;
  }
</style>
