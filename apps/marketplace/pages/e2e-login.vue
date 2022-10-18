<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import keyring from '@polkadot/ui-keyring'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { ss58Of } from '~~/utils/config/chain.config'

@Component({})
export default class E2ELogin extends PrefixMixin {
  created() {
    const mnemonic = mnemonicGenerate(12)
    const { pair } = keyring.addUri(mnemonic, '', {
      name: 'mnemonic acc',
    })
    // TODO: check 'loadAll' error, approx 1 in 10 tests fail without this
    keyring.setSS58Format(ss58Of(this.urlPrefix))
    keyring.addPair(pair, '')
    const account = pair.address
    this.$store.dispatch('setAuth', { address: account })
    localStorage.setItem('kodaauth', account)
    this.$router.push('/')
  }
}
</script>
