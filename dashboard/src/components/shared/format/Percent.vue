<template>
  <div>{{value | toPercent }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex'


@Component
export default class Money extends Vue {
  @Prop({default: 0}) readonly value: number | string | undefined;

  get chainProperties() {
    return this.$store.getters.getChainProperties;
  }
}

</script>
