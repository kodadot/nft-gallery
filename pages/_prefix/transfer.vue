<template>
  <Transfer v-if="redesign" />
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
  setup() {
    const { redesign } = useExperiments()

    return {
      redesign,
    }
  },
}
</script>
