import '@polkadot/api-augment'
import keyring from '@polkadot/ui-keyring'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import correctFormat from '~/utils/ss58Format'

export default ({ store, isDev }) => {
  const ss58Format = store.getters['chain/getChainProperties58Format']
  cryptoWaitReady().then(() => {
    keyring.loadAll({
      ss58Format: correctFormat(ss58Format),
      type: 'sr25519',
      isDevelopment: isDev,
    })
  })
}
