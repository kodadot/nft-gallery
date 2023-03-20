<template>
  <table v-if="nonZeroAssetList.length !== 0">
    <thead>
      <tr>
        <th class="is-size-7 has-text-weight-normal">
          {{ $t('general.asset') }}
        </th>
        <th class="is-size-7 has-text-weight-normal has-text-right">
          {{ $t('general.balance') }}
        </th>
        <th class="is-size-7 has-text-weight-normal has-text-right">USD</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="asset in nonZeroAssetList" :key="asset.id">
        <td>{{ asset.symbol }}</td>
        <td class="has-text-right">
          <Money :value="Number(asset.balance)" inline hide-unit />
        </td>
        <td class="has-text-right">{{ '$' + usdValueFormat(asset) }}</td>
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
import { useFiatStore } from '@/stores/fiat'

const { accountId } = useAuth()
const fiatStore = useFiatStore()
const { urlPrefix, client } = usePrefix()
const { $apollo, $consola, $set } = useNuxtApp()
const emit = defineEmits(['totalValueChange'])

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
  const DECIMALS = 12
  if (asset.symbol === 'KSM') {
    const value =
      checkInvalidBalanceFilter(asset.balance) * Math.pow(10, -1 * DECIMALS)
    return calculateExactUsdFromToken(
      value,
      Number(fiatStore.getCurrentKSMValue)
    )
  }
  if (asset.symbol === 'BSX') {
    const value =
      checkInvalidBalanceFilter(asset.balance) * Math.pow(10, -1 * DECIMALS)

    return calculateExactUsdFromToken(
      value,
      Number(fiatStore.getCurrentBSXValue)
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
  () => [accountId.value, urlPrefix.value],
  async () => {
    await loadAssets()
  },
  { immediate: true }
)

onMounted(async () => {
  fiatStore.fetchFiatPrice()
})
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 0.25rem;
  overflow: hidden;

  th {
    @include ktheme() {
      @include ktheme() {
        color: theme('k-grey');
      }
    }
  }

  tr:last-child {
    border-bottom: none;
  }
}
</style>
