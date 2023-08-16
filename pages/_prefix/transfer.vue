<template>
  <Transfer />
</template>

<script lang="ts">
export default {
  name: 'TransferPage',
  components: {
    Transfer: () => import('@/components/transfer/Transfer.vue'),
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
