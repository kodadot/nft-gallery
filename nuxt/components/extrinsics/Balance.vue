<template>
  <b-tag
    class="balance-tag"
    type="is-dark"
    size="is-medium"
  >
    With balance: {{ balance }}
  </b-tag>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'

@Component
export default class Balance extends Vue {
  @Prop() public account!: string;

  private currentBalance = null;

  get balance() {
    return this.currentBalance
  }

  @Watch('account')
  public async onAccountChange(value: string) {

    if (value && (this as any).$http) {
      const { api } = (this as any).$http
      this.currentBalance = await api.query.balances.freeBalance(value)
    }
  }
}
</script>

<style scoped>
  .balance-tag {
    margin-bottom: 0.5em;
  }
</style>
