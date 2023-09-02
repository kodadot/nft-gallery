<template>
  <div>
    <InfoBox
      v-if="showChanged"
      variant="success"
      :title="
        $t('transfers.invalidAddress.addressChanged.title', {
          selectedChain: unit,
        })
      "
      @close="onClose">
      <Markdown
        :source="
          $t('transfers.invalidAddress.addressChanged.content', {
            selectedChain: unit,
          })
        " />
    </InfoBox>

    <InfoBox
      v-else-if="addressCheck && showAddressCheck"
      variant="fail"
      :title="$t(`transfers.invalidAddress.${addressCheck.type}.title`)"
      @close="onClose">
      <Markdown
        :source="
          $t(`transfers.invalidAddress.${addressCheck.type}.content`, {
            addressChain: addressCheck.value,
            selectedChain: unit,
          })
        " />

      <template v-if="isWrongSubstrateNetworkAddress" #footer>
        <div class="is-flex is-align-items-center">
          <NeoButton
            no-shadow
            rounded
            size="small"
            @click.native="changeAddress">
            {{
              $t(`transfers.invalidAddress.changeToChainAddress`, {
                selectedChain: unit,
              })
            }}
          </NeoButton>
          <a
            href="https://www.youtube.com/watch?v=3gPvGym8H7I"
            target="_blank"
            class="ml-2 is-size-7 is-blue">
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
import { CHAINS } from '@/libs/static/src/chains'
import InfoBox from '@/components/shared/view/InfoBox.vue'
import { NeoButton } from '@kodadot1/brick'
import { type Prefix, chainNames } from '@kodadot1/static'

enum AddressType {
  ETHEREUM = 'ethereum',
  WRONG_SUBSTRATE_NETWORK_ADDRESS = 'wrong_substrate_network_address',
  UNKNOWN = 'unknown',
}

type AddressCheck = {
  valid: boolean
  type?: AddressType
  value?: string
}

const CHAINS_ADDRESS_CHECKS: Prefix[] = ['rmrk', 'bsx', 'movr', 'glmr', 'dot']

const emit = defineEmits(['check', 'change'])
const props = defineProps<{
  address: string
}>()

const { chainProperties, unit } = useChain()
const { urlPrefix } = usePrefix()
const ss58Format = computed(() => chainProperties.value?.ss58Format)
const addressCheck = ref<AddressCheck | null>(null)
const showAddressCheck = ref(false)
const showChanged = ref(false)

const isWrongSubstrateNetworkAddress = computed(
  () => addressCheck.value?.type === AddressType.WRONG_SUBSTRATE_NETWORK_ADDRESS
)

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
  showAddressCheck.value = false
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
      showAddressCheck.value = !addressCheck.value.valid
    } else {
      showAddressCheck.value = false
      showChanged.value = false
    }
  }
)

watch(showAddressCheck, () => {
  if (showAddressCheck.value) {
    showChanged.value = false
  }
})

watch(addressCheck, () => {
  const isValid = addressCheck.value ? addressCheck.value.valid : false

  emit('check', isValid)
})
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.is-blue {
  @include ktheme() {
    color: theme('k-blue') !important;
  }
}
</style>
