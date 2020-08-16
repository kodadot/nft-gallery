<template>
  <ModalWrapper icon="ellipsis-v">
    <BondExtra :stashId="stashId" :bonded="bonded" class="staking-action__modal" />
    <Unbond :stashId="stashId" :bonded="bonded" :controllerId="controllerId" class="staking-action__modal"/>
    <SetControllerAccount :stashId="stashId" :controllerId="controllerId" class="staking-action__modal" />
    <SetRewardDestination :stashId="stashId" :controllerId="controllerId" class="staking-action__modal" />
    <SetCommision :stashId="stashId" :controllerId="controllerId" :actualCommision="0" class="staking-action__modal" />
    <SetSessionKey :stashId="stashId" :controllerId="controllerId" />
  </ModalWrapper>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ModalWrapper from '@/components/shared/modals/ModalWrapper.vue';
import BondExtra from './partial/BondExtra.vue'
import SetCommision from './partial/SetCommision.vue'
import SetSessionKey from './partial/SetSessionKey.vue'
import SetRewardDestination from './partial/SetRewardDestination.vue'
import SetControllerAccount from './partial/SetControllerAccount.vue'
import Unbond from './partial/Unbond.vue'


const components = {
  ModalWrapper,
  BondExtra,
  SetControllerAccount,
  SetRewardDestination,
  SetCommision,
  SetSessionKey,
  Unbond
}

@Component({ components })
export default class  extends Vue {
  @Prop() public readonly stashId!: string;
  @Prop() public readonly controllerId!: string;
  @Prop() public readonly bonded!: number;


}
</script>

<style scoped>
.staking-action__modal {
  margin-bottom: 0.5em;
}
</style>
