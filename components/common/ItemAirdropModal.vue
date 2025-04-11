<template>
  <UserCartModal
    ref="userCartModal"
    mode="airdrop"
    :title="$t('airdrop.modalTitle')"
    :signing-title="$t('airdrop.modalTitle')"
    :get-action="getAction"
    :label="label"
    :disabled="disabled"
    @reset="reset"
  >
    <template #body>
      <hr class="my-4">

      <h2 class="mb-2 font-bold text-text-color capitalize">
        {{ $t('airdrop.transferTo') }}
      </h2>

      <div class="mb-4">
        <textarea
          v-model="batchAddressesInput"
          class="min-w-full max-w-full w-full min-h-[100px] p-2 border rounded-md resize-vertical"
          :placeholder="$t('Enter multiple addresses separated by commas')"
          @input="handleBatchAddressesInput"
        />
        <div class="mt-2 text-sm">
          <p class="text-k-grey">
            {{ $t('airdrop.selectedNfts') }}: {{ airdropItems.length }}
          </p>
          <p
            v-if="addressList.length"
            :class="addressCountClass"
          >
            {{ $t('airdrop.validAddresses') }}: {{ validAddressCount }}/{{ addressList.length }}
          </p>
        </div>
      </div>

      <div class="max-h-[200px] overflow-y-auto">
        <div
          v-for="(address, index) in addressList"
          :key="index"
          class="flex items-center mb-2 p-2 bg-gray-50 rounded"
        >
          <div class="flex-1 truncate">
            {{ address }}
          </div>
          <div class="ml-2 flex items-center">
            <KIcon
              :name="addressValidityList[index] ? 'i-mdi:check-circle' : 'i-mdi:alert-circle'"
              :class="addressValidityList[index] ? 'text-green-500' : 'text-red-500'"
              size="small"
            />
          </div>
        </div>
      </div>

      <div class="mt-4 max-h-[200px] overflow-y-auto">
        <h3 class="mb-2 font-bold">
          {{ $t('NFT Distribution') }}
        </h3>
        <div
          v-for="(item, index) in airdropItems"
          :key="item.id"
          class="flex items-center mb-2 text-sm"
        >
          <span class="text-k-grey">#{{ item.id }} - {{ item.collection.name }}</span>
          <KIcon
            name="i-mdi:arrow-right"
            size="small"
            class="mx-2"
          />
          <span :class="validAddressList[index] ? 'text-green-500' : 'text-red-500'">
            {{ shortAddress(validAddressList[index]) || $t('airdrop.notAssigned') }}
          </span>
        </div>
      </div>
    </template>
  </UserCartModal>
</template>

<script setup lang="ts">
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { Interaction } from '@/utils/shoppingActions'
import type { ActionAirdrop } from '@/composables/transaction/types'
import { type UserCartModalExpose } from '@/components/common/userCart/UserCartModal.vue'
import shortAddress from '@/utils/shortAddress'

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { isCurrentAccount } = useAuth()

const { chainProperties } = useChain()
const ss58Format = computed(() => chainProperties.value?.ss58Format)

const batchAddressesInput = ref('')
const userCartModal = ref<UserCartModalExpose>()
const addressList = ref<string[]>([])
const addressValidityList = ref<boolean[]>([])
const validAddressList = ref<string[]>([])

const validAddressCount = computed(() =>
  validAddressList.value.length,
)

const airdropItems = computed(() => userCartModal.value?.items || [])

const label = computed(() => {
  if (!validAddressList.value.length) {
    return $i18n.t('transaction.inputAddressFirst')
  }
  return $i18n.t('airdrop.modalTitle')
})

const disabled = computed(() =>
  !(validAddressList.value.length
    && airdropItems.value.length),
)

const addressCountClass = computed(() => ({
  'text-green-500': validAddressCount.value > 0,
  'text-red-500': validAddressCount.value === 0,
}))

const handleBatchAddressesInput = () => {
  const addresses = [...new Set(
    batchAddressesInput.value
      .split(',')
      .map(addr => addr.trim())
      .filter(addr => addr),
  )]

  addressList.value = addresses
  addressValidityList.value = new Array(addresses.length).fill(false)
  const allValidAddressList: string[] = []
  addresses.forEach((addr, index) => {
    const chainAddr = correctAddressFormat(addr)
    if (chainAddr) {
      const isValid = !isCurrentAccount(chainAddr)
      addressValidityList.value[index] = isValid
      if (isValid) {
        allValidAddressList.push(chainAddr)
      }
    }
  })
  validAddressList.value = allValidAddressList
}

const correctAddressFormat = (address: string) => {
  const publicKey = decodeAddress(address)
  return encodeAddress(publicKey, ss58Format.value)
}

const getAction = (): ActionAirdrop => ({
  interaction: Interaction.AIRDROP,
  urlPrefix: urlPrefix.value,
  addresses: validAddressList.value,
  nfts: airdropItems.value
    .filter((_, index) => validAddressList.value[index])
    .map(item => ({
      id: item.id,
      sn: item.sn,
      collectionId: item.collection.id,
    })),
})

const reset = () => {
  batchAddressesInput.value = ''
  addressList.value = []
  addressValidityList.value = []
  validAddressList.value = []
}

watch(() => airdropItems.value, () => {
  addressList.value = []
  addressValidityList.value = []
  validAddressList.value = []
}, { immediate: true })
</script>
