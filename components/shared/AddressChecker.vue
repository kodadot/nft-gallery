<template>
  <div>
    <InfoBox
      v-if="showChanged"
      variant="success"
      :title="
        $t(`transfers.invalidAddress.addressChanged`, getTranslationVariables())
      "
      @close="onClose">
      <p>
        Address was successfully changed for
        {{ getTranslationVariables().selectedChain }} network. You can double
        check correctness
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
          $t(
            `transfers.invalidAddress.${addressCheck.type}.content`,
            getTranslationVariables()
          )
        "></p>

      <template #footer>
        <NeoButton
          v-if="isWrongSubstrateNetworkAddress"
          no-shadow
          rounded
          size="small"
          @click.native="changeAddress">
          {{
            $t(
              `transfers.invalidAddress.changeToChainAddress`,
              getTranslationVariables()
            )
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
import { CHAINS, chainNames } from '@/libs/static/src/chains'
import InfoBox from '@/components/shared/view/InfoBox.vue'
import { NeoButton } from '@kodadot1/brick'

const emit = defineEmits(['check', 'change'])
const props = defineProps<{
  address: string
}>()

const { chainProperties } = useChain()
const { urlPrefix } = usePrefix()
const ss58Format = computed(() => chainProperties.value?.ss58Format)

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
  value?: string[]
}

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

  const validAddressesChains = Object.keys(CHAINS).filter((chain) => {
    const [isValid] = checkAddressByss58Format(value, CHAINS[chain].ss58Format)
    return isValid
  })

  if (validAddressesChains.length > 0) {
    return {
      valid: false,
      type: AddressType.WRONG_SUBSTRATE_NETWORK_ADDRESS,
      value: validAddressesChains,
    }
  }

  return { valid: false, type: AddressType.UNKNOWN }
}

const onClose = () => {
  addressCheck.value = null
}

const changeAddress = () => {
  const publicKey = decodeAddress(props.address)
  const chainAddress = encodeAddress(publicKey, ss58Format.value)
  showChanged.value = true
  emit('change', chainAddress)
}

const getTranslationVariables = () => ({
  addressChain: addressCheck.value?.value, // TODO: TEMP
  selectedChain: chainNames[urlPrefix.value],
})

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
  emit('check', addressCheck.value ? addressCheck.value.valid : false)
})
</script>
