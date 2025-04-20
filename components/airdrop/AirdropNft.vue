<template>
  <div class="max-w-[480px] mx-auto p-4">
    <NeoButton
      class="mb-6 xl:absolute xl:top-1 xl:left-[40px]"
      variant="outlined-rounded"
      icon-left="arrow-left"
      @click="goBack"
    >
      {{ $t('airdrop.backToProfile') }}
    </NeoButton>

    <div>
      <div class="text-3xl font-semibold mb-6">
        {{ $t('airdrop.airdropNfts') }}
      </div>

      <div class="mb-4">
        <div class="flex justify-between items-center gap-2 mb-4">
          <div class="">
            {{ $t('airdrop.selected') }}
          </div>

          <div class="text-sm px-2 py-1 rounded-full bg-k-grey-light">
            {{ totalNftCount }} {{ $t('airdrop.nfts') }}
          </div>
        </div>

        <div class="text-[14px] flex items-center gap-2 opacity-50">
          <KIcon
            name="i-mdi:arrow-right"
            size="small"
          />
          {{ $t('airdrop.upTo', [totalNftCount]) }}
        </div>
      </div>
      <hr class="my-5 bg-k-grey-light">

      <div class="mb-6">
        <div class="font-semibold mb-3">
          {{ $t('airdrop.distributionMethod') }}
        </div>
        <div class="space-y-6">
          <label
            v-for="mode in DISTRIBUTION_MODES"
            :key="mode.value"
            class="flex items-center cursor-pointer"
          >
            <input
              v-model="distributionMode"
              type="radio"
              :value="mode.value"
              class="mr-3 accent-pink-500 cursor-pointer"
            >
            <div class="text-sm">
              <div
                class="font-semibold mb-1"
              >
                {{ mode.label }}
              </div>
              <div class="opacity-50">
                {{ mode.description }}
              </div>
            </div>
          </label>
        </div>
        <hr class="my-5 bg-k-grey-light">

        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <div class="font-semibold">
              {{ $t('airdrop.recipientAddresses') }}
            </div>
            <div
              :class="addressCounterClass"
              class="text-sm px-2 rounded-full"
            >
              <div v-if="distributionMode === DistributionMode.ONE_PER_ADDRESS">
                {{ $t('airdrop.max', [validAddressCount, totalNftCount]) }}
              </div>
              <div v-if="distributionMode === DistributionMode.RANDOM">
                {{ validAddressCount }} {{ $t('airdrop.addresses') }}
              </div>
            </div>
          </div>
          <div class="text-sm opacity-50 mb-5">
            {{ $t('airdrop.enterOneWalletAddressPerLine') }}
          </div>
          <textarea
            v-model="batchAddressesInput"
            class="bg-background-color w-full min-h-[120px] p-3 border border-gray-200 text-text-color resize-none focus:outline-none"
            :placeholder="`${KODADOT_DAO}\n${KODADOT_DAO}`"
            @input="handleBatchAddressesInput"
          />

          <div
            v-if="invalidAddressList.length"
            class="mb-4"
          >
            <div class="flex items-center justify-between my-4">
              <div class="font-medium">
                {{ $t('airdrop.addressValidation') }}
              </div>
              <div class="flex items-center gap-2">
                <KIcon
                  name="i-mdi:alert-outline"
                  size="small"
                  class="text-k-red"
                />
                {{ invalidAddressList.length }} {{ $t('airdrop.errors') }}
                <NeoButton
                  variant="outlined-rounded"
                  class="!w-[30px] !h-[30px] !min-w-[unset] p-0"
                  :icon="invalidAddressExpanded ? 'chevron-up' : 'chevron-down'"
                  size="small"
                  @click="invalidAddressExpanded = !invalidAddressExpanded"
                />
              </div>
            </div>

            <div
              v-if="invalidAddressExpanded"
              class="space-y-2"
            >
              <div
                v-for="({ index, invalidReason }, idx) in invalidAddressList"
                :key="idx"
                class="flex items-center gap-4 p-2 bg-k-red-accent-2 text-sm"
              >
                <KIcon
                  name="i-mdi:alert-circle-outline"
                  class="text-k-red"
                />

                <div>
                  {{ $t('airdrop.line') }} {{ index + 1 }}: {{ invalidReason }}
                </div>
              </div>
            </div>
          </div>

          <AddressFormatWarning
            v-if="addressPairNeedToBeFixed.length"
            @change="handleAddressAutoCorrection"
          />

          <div
            v-if="addressMoreThanNftWarning"
            class="flex gap-4 px-2 py-1 bg-k-red-accent-2"
          >
            <KIcon
              name="i-mdi:alert-circle-outline"
              class="text-k-red w-[40px]"
            />

            <div class="text-sm">
              {{ $t('airdrop.onePerAddressWarning', [validAddressCount, totalNftCount, validAddressCount - totalNftCount]) }}
            </div>
          </div>
          <div
            v-if="addressLessThanNftWarning"
            class="flex gap-4 px-2 py-1 mt-2 bg-blue-light-cards"
          >
            <KIcon
              name="i-mdi:info-circle-outline"
              class="text-k-blue w-[60px]"
            />
            <div class="text-sm">
              {{ $t('airdrop.onePerAddressLessWarning', [validAddressCount, totalNftCount, validAddressCount, totalNftCount - validAddressCount]) }}
            </div>
          </div>
          <div class="flex gap-3 mt-4">
            <NeoButton
              variant="outlined-rounded"
              icon-left="file"
              size="small"
              class="text-sm px-2"
              @click="triggerFileInput"
            >
              {{ $t('Import CSV') }}
            </NeoButton>
            <input
              ref="fileInput"
              type="file"
              accept=".csv"
              class="hidden"
              @change="handleFileSelect"
            >
            <NeoButton
              v-safe-href="
                `/airdrop/airdrop-template.csv`
              "
              variant="text"
              icon-left="download"
              size="small"
              tag="a"
              class="text-sm px-2"
              download
            >
              {{ $t('airdrop.template') }}
            </NeoButton>
          </div>
        </div>

        <hr class="my-5 bg-k-grey-light">

        <div class="flex items-center gap-2 text-sm mb-4">
          <KIcon
            name="i-mdi:information-slab-circle-outline"
            size="small"
          />
          {{ $t('airdrop.incorrectAddresses') }}
        </div>

        <div class="flex justify-between items-center gap-2">
          <NeoButton
            variant="outlined-rounded"
            @click="goBack"
          >
            {{ $t('cancel') }}
          </NeoButton>
          <NeoButton
            variant="primary-rounded"
            class="capitalize"
            :disabled="disabledButton"
            :label="submitButtonLabel"
            @click="handleSubmit"
          />
        </div>
      </div>
    </div>

    <AirdropConfirmModal
      v-model="isAirdropModalOpen"
      :get-action="getAction"
      :nft-count="totalNftCount"
      :address-count="validAddressCount"
      :distribution-mode="DISTRIBUTION_MODES.find(mode => mode.value === distributionMode)?.label"
    />
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { decodeAddress, encodeAddress, isEthereumAddress } from '@polkadot/util-crypto'
import { useDebounceFn } from '@vueuse/core'
import { Interaction } from '@/utils/shoppingActions'
import { type ActionAirdrop, DistributionMode } from '@/composables/transaction/types'
import { KODADOT_DAO } from '@/utils/support'
import { readTextFile } from '@/composables/massmint/useParseDescriptionFile'
import AddressFormatWarning from '@/components/airdrop/AddressFormatWarning.vue'

const router = useRouter()
const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { isCurrentAccount } = useAuth()
const airdropStore = useAirdropStore()
const { chainProperties } = useChain()
const ss58Format = computed(() => chainProperties.value?.ss58Format)
const batchAddressesInput = ref('')
const airdropItems = computed(() => airdropStore.itemsInChain)
const addressList = ref<string[]>([])
const validAddressList = ref<string[]>([])
const invalidAddressList = ref<{ address: string, index: number, invalidReason: string }[]>([])
const invalidAddressExpanded = ref<boolean>(false)
const isAirdropModalOpen = ref<boolean>(false)
const distributionMode = ref<DistributionMode>(DistributionMode.ONE_PER_ADDRESS)
const fileInput = ref<HTMLInputElement | null>(null)
const addressPairNeedToBeFixed = ref<[string, string][]>([])

const DISTRIBUTION_MODES = computed(() => [
  {
    label: $i18n.t('airdrop.onePerAddress'),
    value: DistributionMode.ONE_PER_ADDRESS,
    description: $i18n.t('airdrop.onePerAddressDescription'),
  },
  {
    label: $i18n.t('airdrop.random'),
    value: DistributionMode.RANDOM,
    description: $i18n.t('airdrop.randomDescription'),
  },
])

const validAddressCount = computed(() =>
  validAddressList.value.length,
)

const totalNftCount = computed(() => airdropItems.value.length)

const submitButtonLabel = computed(() => {
  if (addressPairNeedToBeFixed.value.length) {
    return $i18n.t('airdrop.wrongAddressFormatError')
  }
  if (addressMoreThanNftWarning.value) {
    return $i18n.t('airdrop.moreThanNftWarning')
  }
  if (invalidAddressList.value.length) {
    return $i18n.t('airdrop.fixErrorsFirst')
  }
  if (!validAddressList.value.length) {
    return $i18n.t('airdrop.noAddressesEntered')
  }
  return $i18n.t('airdrop.reviewAirdrop')
})

const addressMoreThanNftWarning = computed<boolean>(() => distributionMode.value === DistributionMode.ONE_PER_ADDRESS && validAddressCount.value > totalNftCount.value)

const addressLessThanNftWarning = computed<boolean>(() => Boolean(
  distributionMode.value === DistributionMode.ONE_PER_ADDRESS
  && validAddressCount.value
  && validAddressCount.value < totalNftCount.value,
))

const disabledButton = computed(() => {
  if (!validAddressList.value.length || invalidAddressList.value.length || !airdropItems.value.length || addressPairNeedToBeFixed.value.length) {
    return true
  }

  if (addressMoreThanNftWarning.value) {
    return true
  }

  return false
})

const addressCounterClass = computed(() => {
  if (distributionMode.value === DistributionMode.ONE_PER_ADDRESS) {
    if (validAddressCount.value > totalNftCount.value) {
      return 'text-k-red bg-k-red-accent-2'
    }
    else if (validAddressCount.value === totalNftCount.value) {
      return 'text-k-green bg-k-green-accent-2'
    }
    return 'text-k-blue bg-blue-light-cards'
  }
  return 'text-k-blue bg-blue-light-cards'
})

const handleAddressAutoCorrection = () => {
  let addressesText = batchAddressesInput.value

  addressPairNeedToBeFixed.value.forEach(([addr, chainAddr]) => {
    addressesText = addressesText.replaceAll(addr, chainAddr)
  })

  batchAddressesInput.value = addressesText
  handleBatchAddressesInput()
}

const handleBatchAddressesInput = useDebounceFn(() => {
  addressPairNeedToBeFixed.value = []
  const addresses = batchAddressesInput.value
    .split('\n')
    .map(addr => addr.trim())

  addressList.value = addresses
  const allValidAddressList: string[] = []
  const allInvalidAddressList: { address: string, index: number, invalidReason: string }[] = []
  addresses.forEach((addr, index) => {
    let invalidReason = ''

    if (addr) {
      const chainAddr = correctAddressFormat(addr)
      if (chainAddr) {
        const isSelfAddress = isCurrentAccount(chainAddr)
        const isDuplicate = allValidAddressList.includes(chainAddr)
        if (chainAddr !== addr) {
          invalidReason = $i18n.t('airdrop.addressWrongNetworkError')
          addressPairNeedToBeFixed.value.push([addr, chainAddr])
        }
        else if (isSelfAddress) {
          invalidReason = $i18n.t('airdrop.ownAddressError')
        }
        else if (isDuplicate) {
          invalidReason = $i18n.t('airdrop.duplicateAddressError')
        }
        else {
          allValidAddressList.push(chainAddr)
          return
        }
      }
      else {
        invalidReason = $i18n.t('airdrop.invalidAddressError')
      }
    }
    else {
      invalidReason = $i18n.t('airdrop.emptyLineError')
    }

    allInvalidAddressList.push({ address: addr, index, invalidReason })
  })
  validAddressList.value = allValidAddressList
  invalidAddressList.value = allInvalidAddressList
}, 1000)

const correctAddressFormat = (address: string) => {
  try {
    if (isEthereumAddress(address)) {
      return null
    }
    const publicKey = decodeAddress(address)
    return encodeAddress(publicKey, ss58Format.value)
  }
  catch (error) {
    return null
  }
}

const getAction = (): ActionAirdrop => ({
  interaction: Interaction.AIRDROP,
  urlPrefix: urlPrefix.value,
  distributionMode: distributionMode.value,
  addresses: validAddressList.value,
  nfts: airdropItems.value
    .map(item => ({
      id: item.id,
      sn: item.sn,
      collectionId: item.collection.id,
    })),
})

const handleSubmit = () => {
  isAirdropModalOpen.value = true
}

const goBack = () => {
  router.back()
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    try {
      batchAddressesInput.value = await readTextFile(file)
      handleBatchAddressesInput()
    }
    catch (error) {
      warningMessage(`${$i18n.t('airdrop.errorReadingCsvFile')}: ${error}`)
      console.error('Error reading CSV file:', error)
    }
    finally {
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  }
}

onMounted(() => {
  if (!airdropStore.itemsInChain.length) {
    router.push('/')
  }
})

onBeforeUnmount(() => {
  airdropStore.clear()
})
</script>
