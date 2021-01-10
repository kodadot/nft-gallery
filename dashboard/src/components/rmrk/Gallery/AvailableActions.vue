<template>
  <div>
    <div v-if="isOwner">
      <b-button type="is-primary">Send</b-button>  
      <b-button type="is-danger is-light">Consume</b-button>
      <b-button type="is-warning is-light">List</b-button>
    </div>
    <div v-if="price">
      <b-button type="is-success">Buy</b-button>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class AvailableActions extends Vue {
  @Prop() public currentOwnerId!: string;
  @Prop() public accountId!: string;
  @Prop() public price!: string;

  get isOwner() {
    const { currentOwnerId, accountId } = this
    return currentOwnerId && accountId && currentOwnerId === accountId;
  }

  get isAvailableToBuy() {
    const { price, accountId } = this
    return accountId && Number(price) > 0
  }
}
</script>
