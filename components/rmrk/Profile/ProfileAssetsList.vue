<template>
  <div v-if="nonSnekBalance === 0">
    <hr
      class="profile-dropdown-divider dropdown-divider"
      aria-role="menuitem" />
    <table>
      <thead>
        <tr>
          <th class="has-text-grey">Asset</th>
          <th class="has-text-grey">Balance</th>
          <th class="has-text-grey">USD</th>
        </tr>
      </thead>
      <tbody v-if="urlPrefix === 'snek' || urlPrefix === 'bsx'">
        <tr v-for="asset in nonZeroAssetList" :key="asset.id">
          <td>{{ asset.symbol }}</td>
          <td>
            <Money :value="Number(asset.balance)" inline hide-unit />
          </td>
          <td>{{ '$' + usdValue(asset) }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="asset in nonZeroAssetList" :key="asset.id">
          <td>{{ asset.symbol }}</td>
          <td>
            <Money :value="Number(asset.balance)" inline hide-unit />
          </td>
          <td>{{ '$' + usdValue(asset) }}</td>
        </tr>
      </tbody>
    </table>
    <hr
      class="profile-dropdown-divider dropdown-divider"
      aria-role="menuitem" />
  </div>
</template>
<script lang="ts" setup>
import assetListByIdList from '@/queries/subsquid/bsx/assetListByIdList.graphql'
import { getAsssetBalance, getKusamaAssetId } from '@/utils/api/bsx/query'
import { useApollo } from '@/utils/config/useApollo'
import { mapToId } from '@/utils/mappers'
import { showNotification } from '@/utils/notification'
import { AssetItem, AssetListQueryResponse } from '@/components/bsx/Asset/types'
import Money from '~/components/shared/format/Money.vue'
import { calculateExactUsdFromToken } from '~/utils/calculation'
import formatBalance, {
  checkInvalidBalanceFilter,
  roundTo,
} from '@/utils/format/balance'

const { accountId } = useAuth()

const { urlPrefix, client } = usePrefix()
const { $apollo, $consola, $set } = useNuxtApp()
const { $store } = useNuxtApp()

const nonSnekBalance = ref<number>(0)

const nonZeroAssetList = computed(() => {
  return assetList.value.filter((asset) => asset.balance !== '0')
})
const assetList = ref<AssetItem[]>([])
const loadAssets = async () => {
  try {
    const { assetList: newAssetList } = await useApollo<
      any,
      AssetListQueryResponse
    >($apollo as any, urlPrefix.value, assetListByIdList, {
      ids: ['0', getKusamaAssetId(client.value), '6'],
    })
    assetList.value = newAssetList
    await fetchAccountBalance()
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
const usdValue = (asset: AssetItem) => {
  if (asset.symbol === 'KSM') {
    let value = checkInvalidBalanceFilter(asset.balance)
    value = roundTo(formatBalance(value, 12, ''), 4)
    return calculateExactUsdFromToken(
      value,
      $store.getters['fiat/getCurrentKSMValue']
    )
  }
  if (asset.symbol === 'BSX') {
    let value = checkInvalidBalanceFilter(asset.balance)
    value = checkInvalidBalanceFilter(
      roundTo(formatBalance(value, 12, ''), 4).replace(',', '')
    )
    return calculateExactUsdFromToken(
      value,
      $store.getters['fiat/getCurrentBSXValue']
    )
  } else {
    return '--'
  }
}

watch(
  () => accountId.value + urlPrefix.value,
  async () => {
    if (urlPrefix.value === 'bsx' || urlPrefix.value === 'snek') {
      nonSnekBalance.value = 0
      await loadAssets()
    }
    if (
      urlPrefix.value === 'rmrk' ||
      urlPrefix.value === 'movr' ||
      urlPrefix.value === 'glmr'
    ) {
      nonSnekBalance.value = 1
    }
  },
  { immediate: true }
)

onMounted(async () => {
  $store.dispatch('fiat/fetchFiatPrice')
})
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
