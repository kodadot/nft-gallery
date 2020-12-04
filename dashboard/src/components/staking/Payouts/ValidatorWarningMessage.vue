<template>
   <b-message v-if="visible" title="Warning" type="is-warning" aria-close-label="Close message">
      <p>Payouts of rewards for a validator can be initiated by any account. This means that as soon as a validator or nominator requests a payout for an era, all the nominators for that validator will be rewarded. Each user does not need to claim individually and the suggestion is that validators should claim rewards for everybody as soon as an era ends.</p>
      <p>If you have not claimed rewards straight after the end of the era, the validator is in the active set and you are seeing no rewards, this would mean that the reward payout transaction was made by another account on your behalf. Always check your favorite explorer to see any historic payouts made to your accounts.</p>
    </b-message>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class ValidatorWarningMessage extends Vue {
  @Prop() public visible!: boolean;
}
</script>
