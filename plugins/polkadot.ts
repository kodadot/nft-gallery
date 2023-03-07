import keyring from '@polkadot/ui-keyring'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import correctFormat from '~/utils/ss58Format'
import { useChainStore } from '@/stores/chain'

export default ({ isDev }): void => {
  const chainStore = useChainStore()
  const ss58Format = chainStore.getChainProperties58Format
  cryptoWaitReady().then(() => {
    keyring.loadAll({
      ss58Format: correctFormat(ss58Format),
      type: 'sr25519',
      isDevelopment: isDev,
    })
  })
}
