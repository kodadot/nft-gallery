<template>
  <Transfer />
</template>

<script lang="ts">
export default {
  name: 'TransferPage',
  components: {
    Transfer: () => import('@/components/transfer/Transfer.vue'),
  },
}
</script>
