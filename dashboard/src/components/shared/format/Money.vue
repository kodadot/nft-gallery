<template>
  <div v-if="!inline">{{value | formatBalance(decimals, unit)}}</div>
  <span v-else>{{value | formatBalance(decimals, unit)}}</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex'


@Component
export default class Money extends Vue {
  @Prop({default: 0}) readonly value: number | string | undefined;
  @Prop(Boolean) readonly inline!: boolean

  get chainProperties() {
    return this.$store.getters.getChainProperties;
  }

  get decimals(): number {
    return this.chainProperties.tokenDecimals
  }

  get unit(): string {
    return this.chainProperties.tokenSymbol
  }

}

</script>
