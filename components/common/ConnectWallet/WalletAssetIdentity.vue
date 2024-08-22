<template>
  <div class="flex items-center justify-between">
    <NuxtLink
      :to="`/${prefix}/u/${account}`"
      class="w-full"
      @click="closeModal"
    >
      <IdentityItem
        :account="account"
        :label="display || shortenedAddress"
        :prefix="prefix"
      >
        <template #default="{ label }">
          <div class="pl-3">
            <div class="font-bold mb-1 truncate max-w-[11rem]">
              {{ profile?.name ? profile?.name : label }}
            </div>

            <div class="text-xs text-k-grey">
              {{ $t('viewProfile') }}
            </div>
          </div>
        </template>
      </IdentityItem>
    </NuxtLink>

    <div class="flex flex-row gap-2 pl-2">
      <a
        v-clipboard:copy="account"
        @click="toast($t('general.copyAddressToClipboard'))"
      >
        <NeoIcon icon="copy" />
      </a>
      <a @click="logout">
        <NeoIcon icon="right-from-bracket" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { useIdentityStore } from '@/stores/identity'

const { toast } = useToast()
const { neoModal } = useProgrammatic()
const { getPrefixByAddress } = useAddress()
const identityStore = useIdentityStore()
const { logout } = useWallet()
const account = computed(() => identityStore.getAuthAddress)

const prefix = computed(() => getPrefixByAddress(account.value))
const { profile } = useFetchProfile(account)

const { display, shortenedAddress } = useIdentity({
  address: account,
})

const closeModal = () => neoModal.closeAll()
</script>
