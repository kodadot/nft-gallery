<template>
  <ModalWrapper icon="ellipsis-v">
    <BondExtra :stashId="stashId" :bonded="bonded" />
    <b-button type="is-primary" icon-left="plus" >Action</b-button>
    <b-button type="is-primary" icon-left="plus" >Action 2</b-button>
    <b-button type="is-primary" icon-left="plus" >Action 3</b-button>

  </ModalWrapper>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ModalWrapper from '@/components/shared/modals/ModalWrapper.vue';
import BondExtra from './partial/BondExtra.vue'

const components = {
  ModalWrapper,
  BondExtra
}

@Component({ components })
export default class  extends Vue {
  @Prop() public readonly stashId!: string;
  @Prop() public readonly controllerId!: string;
  @Prop() public readonly bonded!: number;


}
</script>
