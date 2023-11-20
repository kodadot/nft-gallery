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
      v-if="assetList"
      :loading="loading"
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
import { mapToId } from '@/utils/mappers'
import { notificationTypes, showNotification } from '@/utils/notification'
import Loader from '@/components/shared/Loader.vue'
import AssetTable from '@/components/bsx/Asset/AssetTable.vue'
import { AssetItem } from './types'

const { accountId } = useAuth()

const { client } = usePrefix()

const { howAboutToExecute, initTransactionLoader, isLoading, status } =
  useMetaTransaction()
const currentAsset = ref<string>('0')

const { result: assets } = useQuery(
  assetListByIdList,
  { ids: ['0', getKusamaAssetId(client.value), '6'] },
  { clientId: client.value },
)

const assetList = ref<AssetItem[]>([])
const loading = ref(true)

const fetchAccountBalance = async () => {
  const { apiInstance } = useApi()
  const api = await apiInstance.value
  const mapper = (id: string) => getAsssetBalance(api, accountId.value, id)
  assetList.value.map(mapToId).map(mapper).forEach(updatedBalanceFor)
}

const updatedBalanceFor = async (
  getBalance: Promise<string>,
  index: number,
) => {
  try {
    const balance = await getBalance
    assetList.value = assetList.value.map((asset, i) => {
      return i === index ? { ...asset, balance } : asset
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
      notificationTypes.success,
    )
    fetchCurrentToken()
    fetchAccountBalance()
  })
}

watch(
  [accountId, assets],
  async () => {
    if (assets.value) {
      assetList.value = assets.value.assetList
      await Promise.all([fetchAccountBalance(), fetchCurrentToken()])
      loading.value = false
    }
  },
  { immediate: true },
)
</script>
