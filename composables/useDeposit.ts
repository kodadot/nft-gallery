import type { ComputedRef } from 'vue/types'
import type { PalletBalancesAccountData } from '@polkadot/types/lookup'

import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { CHAINS, type Prefix } from '@kodadot1/static'
import { balanceOf } from '@kodadot1/sub-api'
import {
  getAssetMetadataByAccount,
  getKusamaAssetId,
} from '@/utils/api/bsx/query'
import format from '@/utils/format/balance'

export default function (prefix: ComputedRef<Prefix>) {
  const { apiInstanceByPrefix } = useApi()
  const { accountId } = useAuth()
  const { isBasilisk, isAssetHub } = useIsChain(prefix)

  const balance = ref()

  const collectionDeposit = ref(0)
  const itemDeposit = ref(0)
  const metadataDeposit = ref(0)
  const existentialDeposit = ref(0)

  const totalCollectionDeposit = ref('0')
  const totalItemDeposit = ref('0')

  const chainSymbol = ref('')

  watchEffect(async () => {
    if (prefix.value) {
      const api = await apiInstanceByPrefix(prefix.value)
      const chain = CHAINS[prefix.value]

      // set deposit amount
      existentialDeposit.value =
        api.consts.balances.existentialDeposit.toNumber()

      if (isAssetHub.value) {
        collectionDeposit.value = api.consts.nfts.collectionDeposit.toNumber()
        itemDeposit.value = api.consts.nfts.itemDeposit.toNumber()
        metadataDeposit.value = api.consts.nfts.metadataDepositBase.toNumber()
      }

      if (isBasilisk.value) {
        collectionDeposit.value =
          api.consts.uniques.collectionDeposit.toNumber()
        itemDeposit.value = api.consts.uniques.collectionDeposit.toNumber()
        metadataDeposit.value =
          api.consts.uniques.metadataDepositBase.toNumber()
      }

      totalCollectionDeposit.value = format(
        metadataDeposit.value +
          collectionDeposit.value +
          existentialDeposit.value,
        chain.tokenDecimals,
        false,
      )
      totalItemDeposit.value = format(
        metadataDeposit.value + itemDeposit.value + existentialDeposit.value,
        chain.tokenDecimals,
        false,
      )
    }
  })

  watchEffect(async () => {
    if (prefix.value) {
      const api = await apiInstanceByPrefix(prefix.value)

      // get chain symbol and decimals
      const chainInfo = await api.registry.getChainProperties()
      chainSymbol.value = chainInfo?.tokenSymbol.toHuman()?.[0]

      if (isBasilisk.value && accountId.value) {
        const assetMetadata = await getAssetMetadataByAccount(
          api,
          accountId.value,
        )

        chainSymbol.value = assetMetadata.symbol
      }

      // set balance
      if (accountId.value) {
        const chain = CHAINS[prefix.value]
        const publicKey = decodeAddress(accountId.value)
        const prefixAddress = encodeAddress(publicKey, chain.ss58Format)

        balance.value = await balanceOf(api, prefixAddress)

        if (isBasilisk.value && chainSymbol.value === 'KSM') {
          balance.value = (
            (await api.query.tokens.accounts(
              prefixAddress,
              getKusamaAssetId(prefix.value),
            )) as PalletBalancesAccountData
          ).free.toString()
        }

        balance.value = format(balance.value, chain.tokenDecimals, false)
      }
    }
  })

  return {
    balance,
    collectionDeposit,
    itemDeposit,
    metadataDeposit,
    existentialDeposit,
    totalCollectionDeposit,
    totalItemDeposit,
    chainSymbol,
  }
}
