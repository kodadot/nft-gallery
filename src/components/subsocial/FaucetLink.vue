<template>
  <a href="https://app.subsocial.network/faucet" target="_blank">{{ $t('subsocial.faucet') }}</a>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class FaucetLink extends Vue {

  private value2: any;
  @Prop() public value!: any;
}
</script>
