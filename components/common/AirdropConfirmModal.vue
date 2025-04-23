<template>
  <ActionModal
    :is-modal-active="isOpen"
    :get-action="getAction"
    :label="$t('airdrop.confirmAndSend')"
    :title="$t('airdrop.modalTitle')"
    :signing-title="$t('airdrop.modalTitle')"
    @close="isOpen = false"
    @success="onSuccess"
  >
    <template #body>
      <div class="flex flex-col gap-3">
        <div
          class="flex justify-between pt-5"
        >
          <span class="text-k-grey">{{ $t('airdrop.selectedNfts') }}</span>
          <span>{{ nftCount }} {{ $t('airdrop.nfts') }}</span>
        </div>
        <div
          class="flex justify-between"
        >
          <span class="text-k-grey">{{ $t('airdrop.distribution') }}</span>
          <span>{{ distributionMode }}</span>
        </div>
        <div
          class="flex justify-between"
        >
          <span class="text-k-grey">{{ $t('transfers.recipients') }}</span>
          <span>{{ addressCount }} {{ $t('airdrop.addresses') }}</span>
        </div>
      </div>

      <hr class="my-5">
      <div
        class="flex gap-2 text-xs mb-4 bg-k-yellow-light px-2 py-1"
      >
        <KIcon
          name="i-mdi:information-slab-circle-outline"
          size="small"
          class="text-k-orange4"
        />
        {{ $t('airdrop.incorrectAddresses') }}
      </div>
    </template>
  </ActionModal>
</template>

<script setup lang="ts">
import type { ActionAirdrop } from '@/composables/transaction/types'

const { urlPrefix } = usePrefix()
const router = useRouter()

const isOpen = defineModel<boolean>({ required: true })

defineProps<{
  getAction: () => ActionAirdrop
  nftCount: number
  addressCount: number
  distributionMode?: string
}>()

const onSuccess = () => {
  setTimeout(() => {
    router.push(`/${urlPrefix}/profile`)
  }, 5000)
}
</script>
