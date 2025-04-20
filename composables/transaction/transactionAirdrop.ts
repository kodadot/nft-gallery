import { checkAddress, isAddress } from '@polkadot/util-crypto'
import type { ApiPromise } from '@polkadot/api'
import type { ActionAirdrop, ExecuteTransaction } from './types'
import { DistributionMode } from './types'
import { Interaction } from '@/utils/shoppingActions'
import {
  assetHubParamResolver,
  getApiCall,
} from '@/utils/gallery/abstractCalls'

import { isLegacy } from '@/components/unique/utils'
import { ss58Of } from '@/utils/config/chain.config'
import { warningMessage } from '@/utils/notification'
import correctFormat from '@/utils/ss58Format'

function checkTxsAirdrop(item: ActionAirdrop) {
  const addresses = item.addresses

  if (!addresses.length || !item.nfts.length) {
    warningMessage('No addresses or NFTs')
    return false
  }

  return addresses.every((address) => {
    const [, err] = checkAddress(
      address,
      correctFormat(ss58Of(item.urlPrefix)),
    )

    if (!isAddress(address)) {
      warningMessage('Invalid address')
      return false
    }

    if (err) {
      warningMessage(err)
      return false
    }

    return true
  })
}

function generateRandomDistribution(item: ActionAirdrop, api: ApiPromise) {
  const { nfts, addresses } = item

  if (!addresses.length || !nfts.length) {
    return []
  }
  const randomNfts = Array.from(nfts).sort(() => Math.random() - 0.5)
  const randomAddresses = Array.from(addresses).sort(() => Math.random() - 0.5)

  if (randomAddresses.length < randomNfts.length) {
    // address count less than nfts count

    return randomNfts.map((nft, index) => {
      const addressIndex = index % randomAddresses.length
      const targetAddress = randomAddresses[addressIndex]
      const legacy = isLegacy(nft.id)
      const paramResolver = assetHubParamResolver(legacy)
      const cb = getApiCall(api, item.urlPrefix, Interaction.SEND, legacy)
      return cb(...paramResolver(nft.id, Interaction.SEND, targetAddress))
    })
  }
  else {
    // address count greater than or equal to nfts count
    return randomNfts.map((nft, index) => {
      const legacy = isLegacy(nft.id)
      const paramResolver = assetHubParamResolver(legacy)
      const cb = getApiCall(api, item.urlPrefix, Interaction.SEND, legacy)
      return cb(...paramResolver(nft.id, Interaction.SEND, randomAddresses[index]))
    })
  }
}

function generateOnePerAddressDistribution(item: ActionAirdrop, api: ApiPromise) {
  const randomNfts = Array.from(item.nfts).sort(() => Math.random() - 0.5)

  if (randomNfts.length < item.addresses.length) {
    warningMessage('Not enough NFTs for one-per-address distribution')
    return []
  }

  return item.addresses.map((address, index) => {
    const nft = randomNfts[index]
    const legacy = isLegacy(nft.id)
    const paramResolver = assetHubParamResolver(legacy)
    const cb = getApiCall(api, item.urlPrefix, Interaction.SEND, legacy)
    return cb(...paramResolver(nft.id, Interaction.SEND, address))
  })
}

function execSendAssetHub(item: ActionAirdrop, api, executeTransaction) {
  const argGenerator = item.distributionMode === DistributionMode.ONE_PER_ADDRESS ? generateOnePerAddressDistribution : generateRandomDistribution
  const arg = argGenerator(item, api)

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [arg],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export function execAirdropTx(
  item: ActionAirdrop,
  api,
  executeTransaction: ExecuteTransaction,
) {
  if (!checkTxsAirdrop(item)) {
    return
  }

  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    execSendAssetHub(item, api, executeTransaction)
  }
}
