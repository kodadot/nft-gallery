import { cryptoWaitReady } from '@polkadot/util-crypto'
import correctFormat from '~/utils/ss58Format'
import { useChainStore } from '@/stores/chain'

// export default ({ isDev }): void => {

// }

export default defineNuxtPlugin(async () => {
  if (!process.client) {
    return
  }

  const { default: keyring } = await import('@polkadot/ui-keyring')

  const chainStore = useChainStore()
  const ss58Format = chainStore.getChainProperties58Format
  cryptoWaitReady().then(() => {
    keyring.loadAll({
      ss58Format: correctFormat(ss58Format),
      type: 'sr25519',
      // isDevelopment: isDev,
    })
  })
})
