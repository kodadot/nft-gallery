<template>
  <div>
    <NeoField :type="type" :message="error" :label="$t(label)">
      <NeoInput
        v-model="inputValue"
        :icon-right="iconRight"
        :placeholder="placeholder"
        icon-right-clickable
        @icon-right-click="clearIconClick" />
    </NeoField>

    <InfoBox
      v-if="addressCheck && !addressCheck.valid"
      variant="fail"
      :title="$t(`transfers.invalidAddress.${addressCheck.type}.title`)"
      @close="addressCheck = null">
      <p
        v-html="
          $t(
            `transfers.invalidAddress.${addressCheck.type}.content`,
            getTranslationVariables()
          )
        "></p>

      <template #footer>
        <NeoButton
          v-if="
            addressCheck.type === AddressType.WRONG_SUBSTRATE_NETWORK_ADDRESS
          "
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

    <InfoBox
      v-else-if="showChanged"
      variant="success"
      :title="
        $t(`transfers.invalidAddress.addressChanged`, getTranslationVariables())
      "
      @close="addressCheck = null">
      <p>
        Address was successfully changed for
        {{ getTranslationVariables().selectedChain }} network. You can double
        check correctness
        <nuxt-link
          as="a"
          to="https://kusama.subscan.io/tools/format_transform"
          target="_blank"
          >here</nuxt-link
        >
      </p>
    </InfoBox>
  </div>
</template>

<script lang="ts" setup>
import correctFormat from '@/utils/ss58Format'
import {
  checkAddress,
  decodeAddress,
  encodeAddress,
  isAddress,
  isEthereumAddress,
} from '@polkadot/util-crypto'
import { NeoField, NeoInput } from '@kodadot1/brick'
import InfoBox from '@/components/shared/view/InfoBox.vue'
import { CHAINS } from '~~/libs/static/dist'
import { chainNames } from '@/libs/static/src/chains'
import { NeoButton } from '@kodadot1/brick'

const { urlPrefix } = usePrefix()

const emit = defineEmits(['input', 'invalid'])
const props = withDefaults(
  defineProps<{
    value: string
    label: string
    emptyOnError?: boolean
    strict: boolean
    icon?: string
    placeholder?: string
    withAddressChecker?: boolean
  }>(),
  {
    label: 'Insert Address',
    strict: true,
    icon: '',
    placeholder: '',
    emptyOnError: false,
  }
)

const { chainProperties } = useChain()
const error = ref<string | null>('')
const ss58Format = computed(() => chainProperties.value?.ss58Format)
const type = computed(() => (error.value ? 'is-danger' : ''))
const iconRight = computed(() => {
  if (inputValue.value && props.icon === 'close-circle') {
    return 'close-circle'
  }
  return ''
})
const inputValue = computed({
  get: () => props.value,
  set: (value) => handleInput(value),
})

const clearIconClick = () => {
  inputValue.value = ''
  emit('input', '')
}

const addressCheck = ref<AddressCheck | null>(null)
const showChanged = ref(false)

enum AddressType {
  ETHEREUM = 'ethereum',
  WRONG_SUBSTRATE_NETWORK_ADDRESS = 'wrong_substrate_network_address',
  UNKNOWN = 'unknown',
}

type AddressCheck = {
  valid: boolean
  type?: AddressType
  value?: string[]
}

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

const changeAddress = () => {
  const publicKey = decodeAddress(inputValue.value)
  const chainAddress = encodeAddress(publicKey, ss58Format.value)
  inputValue.value = chainAddress
  showChanged.value = true
}

const getTranslationVariables = () => ({
  addressChain: addressCheck.value?.value, // TODO: TEMP
  selectedChain: chainNames[urlPrefix.value],
})

const checkAddressByss58Format = (value: string, ss58: number) =>
  checkAddress(value, correctFormat(ss58))

const handleInput = (value: string) => {
  emit('input', value)

  if (props.withAddressChecker && !!value) {
    addressCheck.value = null
    addressCheck.value = getAddressCheck(value)
    return
  }

  if (props.strict) {
    const [, err] = checkAddressByss58Format(value, ss58Format.value)
    error.value = value ? err : ''
  } else {
    if (!props.emptyOnError && !value) {
      error.value = ''
    } else {
      error.value = isAddress(value) ? '' : 'Invalid address'
    }
  }

  return props.emptyOnError && error.value ? '' : value
}
</script>
