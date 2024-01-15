<template>
  <div>
    <InfoBox
      v-if="showChanged"
      variant="success"
      :title="
        $t('transfers.invalidAddress.addressChanged.title', {
          selectedChain: currentChainName,
        })
      "
      data-testid="addresschecker-infobox-convertion-success"
      @close="onClose">
      <div
        v-dompurify-html="
          $t('transfers.invalidAddress.addressChanged.content', {
            selectedChain: currentChainName,
          })
        "
        class="address-changed" />
    </InfoBox>

    <InfoBox
      v-else-if="addressCheck && showAddressCheck"
      variant="fail"
      :title="$t(`transfers.invalidAddress.${addressCheck.type}.title`)"
      data-testid="addresschecker-infobox-invalid"
      @close="onClose">
      <div
        v-dompurify-html="
          $t(`transfers.invalidAddress.${addressCheck.type}.content`, {
            addressChain: addressCheck.value,
            selectedChain: currentChainName,
          })
        " />

      <template v-if="isWrongNetworkAddress" #footer>
        <div class="flex items-center">
          <NeoButton
            no-shadow
            rounded
            size="small"
            variant="k-pink"
            data-testid="addresschecker-button-change-to"
            @click="changeAddress">
            {{
              $t(`transfers.invalidAddress.changeToChainAddress`, {
                selectedChain: currentChainName,
              })
            }}
          </NeoButton>
          <a
            v-safe-href="`https://www.youtube.com/watch?v=3gPvGym8H7I`"
            target="_blank"
            class="ml-2 text-xs is-blue">
            {{ $t('helper.learnMore') }}
          </a>
        </div>
      </template>
    </InfoBox>
  </div>
</template>

<script setup lang="ts">
import {
  checkAddress,
  decodeAddress,
  encodeAddress,
  isEthereumAddress,
} from '@polkadot/util-crypto'
import correctFormat from '@/utils/ss58Format'
import { isValidAddress } from '@/utils/account'
import { CHAINS } from '@/libs/static/src/chains'
import InfoBox from '@/components/shared/view/InfoBox.vue'
import { NeoButton } from '@kodadot1/brick'
import { type Prefix, chainNames } from '@kodadot1/static'

enum AddressType {
  ETHEREUM = 'ethereum',
  WRONG_NETWORK_ADDRESS = 'wrong_network_address',
  UNKNOWN = 'unknown',
}

type AddressCheck = {
  valid: boolean
  type?: AddressType
  value?: string
}

const CHAINS_ADDRESS_CHECKS: Prefix[] = ['rmrk', 'ksm', 'dot']

const emit = defineEmits(['check', 'change'])
const props = defineProps<{
  address: string
}>()

const { $i18n } = useNuxtApp()
const { chainProperties } = useChain()
const { urlPrefix } = usePrefix()
const currentChainName = computed(() => chainNames[urlPrefix.value])
const ss58Format = computed(() => chainProperties.value?.ss58Format)
const addressCheck = ref<AddressCheck | null>(null)
const showAddressCheck = ref(false)
const showChanged = ref(false)

const isWrongNetworkAddress = computed(
  () => addressCheck.value?.type === AddressType.WRONG_NETWORK_ADDRESS,
)

const checkAddressByss58Format = (value: string, ss58: number) => {
  const [isValid] = checkAddress(value, correctFormat(ss58))
  return isValid
}

const getAddressCheck = (value: string): AddressCheck => {
  if (isEthereumAddress(value)) {
    return { valid: false, type: AddressType.ETHEREUM }
  }

  const isValidCurrentChainAddress = checkAddressByss58Format(
    value,
    ss58Format.value,
  )

  if (isValidCurrentChainAddress) {
    return { valid: true }
  }

  const GENERIC_SUBSTRATE_SS58_FORMAT = 42
  const isValidGeneric = checkAddressByss58Format(
    value,
    GENERIC_SUBSTRATE_SS58_FORMAT,
  )

  if (isValidGeneric) {
    return { valid: true }
  }

  const [validAddressesChain] = CHAINS_ADDRESS_CHECKS.filter((chain) =>
    checkAddressByss58Format(value, CHAINS[chain].ss58Format),
  )

  if (validAddressesChain) {
    return {
      valid: false,
      type: AddressType.WRONG_NETWORK_ADDRESS,
      value: chainNames[validAddressesChain],
    }
  }

  const isValid = isValidAddress(value)

  if (isValid) {
    return {
      valid: false,
      type: AddressType.WRONG_NETWORK_ADDRESS,
      value: $i18n.t('transfers.invalidAddress.wrongNetwork'),
    }
  }

  return { valid: false, type: AddressType.UNKNOWN }
}

const onClose = () => {
  showChanged.value = false
  showAddressCheck.value = false
}

const changeAddress = () => {
  const publicKey = decodeAddress(props.address)
  const chainAddress = encodeAddress(publicKey, ss58Format.value)
  showChanged.value = true
  emit('change', chainAddress)
  emit('check', true)
}

watch(
  () => props.address,
  (address) => {
    if (address !== '') {
      addressCheck.value = getAddressCheck(address)
      showAddressCheck.value = !addressCheck.value.valid
    } else {
      showAddressCheck.value = false
      showChanged.value = false
      addressCheck.value = null
    }
  },
)

watch(showAddressCheck, () => {
  if (showAddressCheck.value) {
    showChanged.value = false
  }
})

watch(addressCheck, (check) => {
  let isValid = !check

  if (!isValid) {
    isValid = check ? check.valid : false
  }

  emit('check', isValid)
})
</script>
<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.is-blue {
  @include ktheme() {
    color: theme('k-blue') !important;
    &:hover {
      color: theme('k-blue-hover') !important;
    }
  }
}

.address-changed {
  :deep(a) {
    @include ktheme() {
      color: theme('k-blue') !important;
      &:hover {
        color: theme('k-blue-hover') !important;
      }
    }
  }
}
</style>
