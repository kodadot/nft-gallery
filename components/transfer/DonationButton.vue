<template>
  <b-button
    type="is-bordered-light share-button"
    icon-left="gift"
    @click="goToTransfer">
  </b-button>
</template>

<script lang="ts" setup>
const props = defineProps<{
  address: string
}>()
const router = useRouter()

function goToTransfer() {
  router.push({
    path: '/ksm/transfer',
    query: { target: props.address, usdamount: '10', donation: 'true' },
  })
}
</script>
