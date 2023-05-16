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
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const identityStore = useIdentityStore()
const realBalance = computed(() => identityStore.auth.balance[urlPrefix.value])
</script>
