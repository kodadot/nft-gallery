<template>
  <p v-if="accountId" class="subtitle is-size-6">
    <span>{{ $t('general.balance') }}: </span>
    <Money :value="realBalance" inline />
  </p>
</template>

<script setup lang="ts">
import { useIdentityStore } from '@/stores/identity'

const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue')
)
const TokenMoney = defineAsyncComponent(
  () => import('@/components/bsx/format/TokenMoney.vue')
)

// not used? not needed?
defineProps<{
  tokenId?: string
}>()

const { accountId } = useAuth()
const identityStore = useIdentityStore()

const realBalance = computed(() => identityStore.getAuthBalance)

onMounted(() => {
  console.log(realBalance.value)
})
</script>
