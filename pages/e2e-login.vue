<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import keyring from '@polkadot/ui-keyring'

@Component({})
export default class E2ELogin extends Vue {
  created() {
    const mnemonic = mnemonicGenerate(12)
    const { pair, json } = keyring.addUri(mnemonic, '', {
      name: 'mnemonic acc',
    })
    // TODO: check 'loadAll' error, approx 1 in 10 tests fail without this
    keyring.addPair(pair, '')
    const account = pair.address
    this.$store.dispatch('setAuth', { address: account })
    localStorage.setItem('kodaauth', account)
    this.$router.push('/')
  }
}
</script>
