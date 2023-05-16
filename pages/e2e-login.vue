<template>
  <div>
    <p data-cy="mockAddress">{{ mockAddress }}</p>
  </div>
</template>

<script lang="ts" setup>
import { mnemonicGenerate } from '@polkadot/util-crypto'
import keyring from '@polkadot/ui-keyring'
import { ss58Of } from '@/utils/config/chain.config'
import { useIdentityStore } from '@/stores/identity'

const identityStore = useIdentityStore()

const { urlPrefix } = usePrefix()
const mockAddress = ref(false)

onMounted(async () => {
  const mnemonic = mnemonicGenerate(12)
  const { pair } = keyring.addUri(mnemonic, '', {
    name: 'mnemonic acc',
  })

  // TODO: check 'loadAll' error, approx 1 in 10 tests fail without this
  keyring.setSS58Format(ss58Of(urlPrefix.value))
  keyring.addPair(pair, '')
  const account = pair.address

  localStorage.setItem('kodaauth', account)
  await identityStore.setAuth({
    address: account,
    balance: {},
    tokens: {},
  })

  mockAddress.value = true
})
</script>
