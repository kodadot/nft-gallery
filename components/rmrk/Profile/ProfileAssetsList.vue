<template>
  <table v-if="nonZeroAssetList.length !== 0">
    <thead>
      <tr>
        <th class="has-text-grey">{{ $t('general.asset') }}</th>
        <th class="has-text-grey">{{ $t('general.balance') }}</th>
        <th class="has-text-grey">USD</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="asset in nonZeroAssetList" :key="asset.id">
        <td>{{ asset.symbol }}</td>
        <td>
          <Money :value="Number(asset.balance)" inline hide-unit />
        </td>
        <td>{{ '$' + usdValueFormat(asset) }}</td>
      </tr>
    </tbody>
  </table>
  <div v-else class="has-text-grey">
    {{ $t('general.noAssets') }}
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
const emit = defineEmits(['totalValueChange'])

const { urlPrefix, client } = usePrefix()
const { $apollo, $consola, $set, $store } = useNuxtApp()

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

const assetToUsdValue = (asset: AssetItem) => {
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
  }
  return 0
}

const usdValueFormat = (asset: AssetItem) => {
  if (asset.symbol === 'KSM' || asset.symbol === 'BSX') {
    return assetToUsdValue(asset)
  } else {
    return '--'
  }
}

const totalUsdValue = computed(() =>
  nonZeroAssetList.value.map(assetToUsdValue).reduce((a, b) => a + b, 0)
)

watch(totalUsdValue, (value) => {
  emit('totalValueChange', value)
})

watch(
  () => accountId.value,
  async () => {
    await loadAssets()
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
