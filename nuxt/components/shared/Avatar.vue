<template>
  <Identicon
    :size="size"
    :theme="'polkadot'"
    :value="value"
    class="avatar"
  />
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Identicon from '@polkadot/vue-identicon';


@Component({ components: {
  Identicon
} })
export default class Avatar extends Vue {
  @Prop({ default: '' }) public value!: string;
  @Prop({ default: 64 }) public size!: number;
}
</script>

<style lang="scss">
  .avatar {
    & > div {
      display: flex;
      align-items: center;
    }
  }
</style>
