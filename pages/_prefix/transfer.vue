<template>
  <Transfer v-if="isRedesign" />
  <TransferOld v-else />
</template>

<script lang="ts">
export default {
  name: 'TransferPage',

  components: {
    Transfer: () => import('@/components/transfer/Transfer.vue'),
    TransferOld: () => import('@/components/transfer/TransferOld.vue'),
  },
  layout() {
    return 'centered-half-layout'
  },
  data() {
    return {
      isRedesign: false,
    }
  },
  created() {
    const { redesign } = useExperiments()
    this.isRedesign = redesign.value
  },
}
</script>
