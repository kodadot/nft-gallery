<template>
  <div>
    <p data-testid="mockAddress">{{ mockAddress }}</p>
  </div>
</template>

<script lang="ts">
import keyring from '@polkadot/ui-keyring'
import { ss58Of } from '@/utils/config/chain.config'
import { useIdentityStore } from '@/stores/identity'

export default {
  name: 'MockAddressPage',
  setup() {
    const identityStore = useIdentityStore()
    const { urlPrefix } = usePrefix()
    const mockAddress = ref(false)

    onMounted(() => {
      const config = useRuntimeConfig()
      const mnemonic = config.VUE_APP_MNEMONIC_E2E
      const { pair } = keyring.addUri(mnemonic, '', {
        name: 'mnemonic acc',
      })

      // TODO: check 'loadAll' error, approx 1 in 10 tests fail without this
      keyring.setSS58Format(ss58Of(urlPrefix.value))
      keyring.addPair(pair, '')
      const account = pair.address

      localStorage.setItem('kodaauth', account)
      identityStore
        .setAuth({
          address: account,
          tokens: {},
        })
        .then(() => {
          mockAddress.value = true
        })
        .catch((error) => {
          console.error('Error setting auth:', error)
        })
    })

    useHead({
      title: 'Mock Address Generator',
      meta: [
        {
          name: 'description',
          content:
            'This is a mock address generator used for testing and development purposes on the KodaDot platform.',
        },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    })

    return {
      mockAddress,
    }
  },
}
</script>
