<template>
  <div>
    <InfoBox
      v-if="showChanged"
      variant="success"
      :title="
        $t(`transfers.invalidAddress.addressChanged`, { selectedChain: unit })
      "
      @close="onClose">
      <p>
        Address was successfully changed for
        {{ chainName }} network. You can double check correctness
        <nuxt-link as="a" to="https://kusama.subscan.io/tools/format_transform"
          >here</nuxt-link
        >
      </p>
    </InfoBox>

    <InfoBox
      v-else-if="addressCheck && !addressCheck.valid"
      variant="fail"
      :title="$t(`transfers.invalidAddress.${addressCheck.type}.title`)"
      @close="onClose">
      <p
        v-html="
          $t(`transfers.invalidAddress.${addressCheck.type}.content`, {
            addressChain: addressCheck.value,
            selectedChain: unit,
          })
        "></p>

      <template #footer>
        <NeoButton
          v-if="isWrongSubstrateNetworkAddress"
          no-shadow
          rounded
          size="small"
          @click.native="changeAddress">
          {{
            $t(`transfers.invalidAddress.changeToChainAddress`, {
              addressChain: addressCheck.value,
              selectedChain: unit,
            })
          }}
        </NeoButton>
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
import { CHAINS } from '@/libs/static/src/chains'
import InfoBox from '@/components/shared/view/InfoBox.vue'
import { NeoButton } from '@kodadot1/brick'
import { type Prefix, chainNames } from '@kodadot1/static'

const emit = defineEmits(['check', 'change'])
const props = defineProps<{
  address: string
}>()

const { chainProperties, unit } = useChain()
const { urlPrefix } = usePrefix()
const ss58Format = computed(() => chainProperties.value?.ss58Format)
const chainName = computed(() => chainNames[urlPrefix.value])
const addressCheck = ref<AddressCheck | null>(null)
const showChanged = ref(false)

enum AddressType {
  ETHEREUM = 'ethereum',
  WRONG_SUBSTRATE_NETWORK_ADDRESS = 'wrong_substrate_network_address',
  UNKNOWN = 'unknown',
}

const isWrongSubstrateNetworkAddress = computed(
  () => addressCheck.value?.type === AddressType.WRONG_SUBSTRATE_NETWORK_ADDRESS
)

type AddressCheck = {
  valid: boolean
  type?: AddressType
  value?: string
}

const CHAINS_ADDRESS_CHECKS: Prefix[] = ['rmrk', 'bsx', 'movr', 'glmr', 'dot']

const checkAddressByss58Format = (value: string, ss58: number) =>
  checkAddress(value, correctFormat(ss58))

const getAddressCheck = (value: string): AddressCheck => {
  if (isEthereumAddress(value)) {
    return { valid: false, type: AddressType.ETHEREUM }
  }

  const [isValidCurrentChainAddress] = checkAddressByss58Format(
    value,
    ss58Format.value
  )

  if (isValidCurrentChainAddress) {
    return { valid: true }
  }

  const [validAddressesChain] = CHAINS_ADDRESS_CHECKS.filter((chain) => {
    const [isValid] = checkAddressByss58Format(value, CHAINS[chain].ss58Format)
    return isValid
  })

  if (validAddressesChain) {
    return {
      valid: false,
      type: AddressType.WRONG_SUBSTRATE_NETWORK_ADDRESS,
      value: CHAINS[validAddressesChain].tokenSymbol,
    }
  }

  return { valid: false, type: AddressType.UNKNOWN }
}

const onClose = () => {
  showChanged.value = false
}

const changeAddress = () => {
  const publicKey = decodeAddress(props.address)
  const chainAddress = encodeAddress(publicKey, ss58Format.value)
  showChanged.value = true
  emit('change', chainAddress)
}

watch(
  () => props.address,
  (address) => {
    if (address !== '') {
      addressCheck.value = getAddressCheck(address)
    } else {
      addressCheck.value = null
    }
  }
)

watch(addressCheck, () => {
  const isValid = addressCheck.value ? addressCheck.value.valid : false

  emit('check', isValid)
})
</script>
