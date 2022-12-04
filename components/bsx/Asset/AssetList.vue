<template>
  <div>
    <div class="column is-8 is-offset-2">
      <h1 class="title is-2 has-text-centered">
        {{ $t('Assets') }}
      </h1>
      <p class="subtitle is-size-6 has-text-centered mt-1 mb-1">
        {{
          "Select which asset you'd like to use for paying fees for transactions"
        }}
      </p>
    </div>
    <Loader v-model="isLoading" :status="status" />
    <AssetTable
      :asset-list="assetList"
      :account-id="accountId"
      :current-asset="currentAsset"
      @select="handleTokenSelect" />
  </div>
</template>

<script lang="ts" setup>
import assetListByIdList from '@/queries/subsquid/bsx/assetListByIdList.graphql'
import { setDefaultFeeToken } from '@/utils/api/bsx/extrinsics'
import {
  getAssetIdByAccount,
  getAsssetBalance,
  getKusamaAssetId,
} from '@/utils/api/bsx/query'
import { useApollo } from '@/utils/config/useApollo'
import { mapToId } from '@/utils/mappers'
import { notificationTypes, showNotification } from '@/utils/notification'
import { AssetItem, AssetListQueryResponse } from './types'
import Loader from '@/components/shared/Loader.vue'
import AssetTable from '@/components/bsx/Asset/AssetTable.vue'

const { accountId } = useAuth()

const { urlPrefix, client } = usePrefix()
const { $apollo, $consola, $set } = useNuxtApp()

const { howAboutToExecute, initTransactionLoader, isLoading, status } =
  useMetaTransaction()
const assetList = ref<AssetItem[]>([])
const currentAsset = ref<string>('0')

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

const fetchCurrentToken = async (): Promise<void> => {
  const { apiInstance } = useApi()
  const api = await apiInstance.value
  const currentToken = await getAssetIdByAccount(api, accountId.value)
  currentAsset.value = currentToken
}

const handleTokenSelect = async (id: string) => {
  const { apiInstance } = useApi()
  const api = await apiInstance.value
  const { call, args } = setDefaultFeeToken(api, id)
  initTransactionLoader()
  howAboutToExecute(accountId.value, call, args, (blockNumber) => {
    showNotification(
      `[ASSET] Since block ${blockNumber}, you pay in different token`,
      notificationTypes.success
    )
    fetchCurrentToken()
    fetchAccountBalance()
  })
}

watch(
  () => accountId.value,
  async () => {
    await loadAssets()
    await fetchCurrentToken()
  },
  { immediate: true }
)
</script>
