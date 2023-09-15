<template>
  <div v-if="account">
    <div class="auth-avatar">
      <Avatar :value="account" :size="size" />
      <span class="subtitle has-text-weight-bold auth-avatar-title">
        <Identity :address="account" hide-identity-popover />
      </span>
    </div>
  </div>
  <ConnectWalletButton v-else label="general.connect_wallet" />
</template>

<script lang="ts" setup>
import Avatar from '@/components/shared/Avatar.vue'
import ConnectWalletButton from '@/components/shared/ConnectWalletButton.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import { useIdentityStore } from '@/stores/identity'

const emit = defineEmits(['input'])
const identityStore = useIdentityStore()
const account = computed({
  get: () => identityStore.getAuthAddress,
  set: (account: string) => identityStore.setAuth({ address: account }),
})

withDefaults(
  defineProps<{
    size?: number
  }>(),
  {
    size: 24,
  }
)

onMounted(() => {
  if (account.value) {
    console.log(account.value)
    emit('input', account.value)
  }
})
</script>

<style scoped>
.auth-avatar {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
}

.auth-avatar-title {
  padding-left: 0.3em;
}
</style>
