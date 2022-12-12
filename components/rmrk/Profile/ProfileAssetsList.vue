<template>
  <table>
    <thead>
      <tr>
        <th class="has-text-grey">Asset</th>
        <th class="has-text-grey">Balance</th>
        <th class="has-text-grey">USD</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="asset in assetList" :key="asset.id">
        <td>{{ asset.symbol }}</td>
        <td><Money :value="Number(asset.balance)" inline hide-unit /></td>
        <td>{{ '$' + usdValue(asset) }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import assetListByIdList from '@/queries/subsquid/bsx/assetListByIdList.graphql'
import { getAsssetBalance, getKusamaAssetId } from '@/utils/api/bsx/query'
import { useApollo } from '@/utils/config/useApollo'
import { mapToId } from '@/utils/mappers'
import { showNotification } from '@/utils/notification'
import { AssetItem, AssetListQueryResponse } from '@/components/bsx/Asset/types'
import Money from '~/components/shared/format/Money.vue'
import { calculateExactUsdFromKsm } from '~/utils/calculation'
import formatBalance, {
  checkInvalidBalanceFilter,
  roundTo,
} from '@/utils/format/balance'
import { getBsxPrice, getKsmPrice } from '~/utils/coingecko'

const { accountId } = useAuth()

const { urlPrefix, client } = usePrefix()
const { $apollo, $consola, $set } = useNuxtApp()
const { $store } = useNuxtApp()

const { howAboutToExecute, initTransactionLoader, isLoading, status } =
  useMetaTransaction()
const assetList = ref<AssetItem[]>([])

const loadAssets = async () => {
  try {
    const { assetList: newAssetList } = await useApollo<
      any,
      AssetListQueryResponse
    >($apollo as any, urlPrefix.value, assetListByIdList, {
      ids: ['0', getKusamaAssetId(client.value), '6'],
    })
    assetList.value = newAssetList.filter((asset) => asset.balance !== '0')
    fetchAccountBalance()
  } catch (e) {
    $consola.warn(e)
    showNotification('Unable to load assets')
  }
}

const fetchAccountBalance = async () => {
  const { apiInstance } = useApi()
  const api = await apiInstance.value
  const mapper = (id: string) => getAsssetBalance(api, accountId.value, id)
  assetList.value.map(mapToId).map(mapper).forEach(updatedBalanceFor)
}

const updatedBalanceFor = async (balance: Promise<string>, index: number) => {
  try {
    $set(assetList.value, index, {
      ...assetList.value[index],
      balance: await balance,
    })
  } catch (e) {
    console.warn('Unable to fetch balance', e)
  }
}
let bsxPrice: void | number
const usdValue = (asset: AssetItem) => {
  if (asset.symbol === 'KSM') {
    let value = checkInvalidBalanceFilter(asset.balance)
    value = roundTo(formatBalance(value, 12, ''), 4)
    return calculateExactUsdFromKsm(
      value,
      $store.getters['fiat/getCurrentKSMValue']
    )
  }
}

watch(
  () => accountId.value,
  async () => {
    await loadAssets()
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 0.25rem;
  overflow: hidden;

  tr:last-child {
    border-bottom: none;
  }
}
</style>
