<template>
  <table>
    <thead>
      <tr>
        <th class="has-text-grey">Symbol</th>
        <th class="has-text-grey">Balance</th>
        <th class="has-text-grey">id</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="asset in assetList" :key="asset.id">
        <td>{{ asset.symbol }}</td>
        <td><Money :value="asset.balance" inline hide-unit /></td>
        <td>{{ asset.id }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import assetListByIdList from '@/queries/subsquid/bsx/assetListByIdList.graphql'
import { getAsssetBalance, getKusamaAssetId } from '@/utils/api/bsx/query'
import { useApollo } from '@/utils/config/useApollo'
import { mapToId } from '@/utils/mappers'
import { notificationTypes, showNotification } from '@/utils/notification'
import { AssetItem, AssetListQueryResponse } from '@/components/bsx/Asset/types'
import Money from '~/components/shared/format/Money.vue'

const { accountId } = useAuth()

const { urlPrefix, client } = usePrefix()
const { $apollo, $consola, $set } = useNuxtApp()

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
    assetList.value = newAssetList
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

watch(
  () => accountId.value,
  async () => {
    await loadAssets()
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

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
