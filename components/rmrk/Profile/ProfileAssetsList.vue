<template>
  <div class="profile-assets-list">
    <div class="is-flex is-justify-content-space-between">
      <div class="has-text-left has-text-grey is-size-7">
        {{ 'Asset' }}
        <div>
          <span class="has-text-weight-bold">
            {{ 'Balance' }}
          </span>
        </div>
      </div>
      <div class="has-text-left has-text-grey is-size-7">
        {{ 'Balance' }}
      </div>
      <div class="has-text-left has-text-grey is-size-7">
        {{ 'USD' }}
      </div>
    </div>
    <hr class="my-2" />
    <div>
      <!--      {{ assetList }}-->
      <!--      <SimpleAccountBalance-->
      <!--        v-for="token in tokens"-->
      <!--        :key="token"-->
      <!--        class="is-size-6"-->
      <!--        :token-id="token" />-->
    </div>
  </div>
</template>
<script lang="ts" setup>
import assetListByIdList from '@/queries/subsquid/bsx/assetListByIdList.graphql'
// import { setDefaultFeeToken } from '@/utils/api/bsx/extrinsics'
import {
  // getAssetIdByAccount,
  getAsssetBalance,
  getKusamaAssetId,
} from '@/utils/api/bsx/query'
import { useApollo } from '@/utils/config/useApollo'
import { mapToId } from '@/utils/mappers'
import { notificationTypes, showNotification } from '@/utils/notification'
import { AssetItem, AssetListQueryResponse } from '@/components/bsx/Asset/types'
import Loader from '@/components/shared/Loader.vue'
import AssetTable from '@/components/bsx/Asset/AssetTable.vue'

const { accountId } = useAuth()

const { urlPrefix, client } = usePrefix()
const { $apollo, $consola, $set } = useNuxtApp()

const { howAboutToExecute, initTransactionLoader, isLoading, status } =
  useMetaTransaction()
const assetList = ref<AssetItem[]>([])
// const currentAsset = ref<string>('0')

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

// const fetchCurrentToken = async (): Promise<void> => {
//   const { apiInstance } = useApi()
//   const api = await apiInstance.value
//   const currentToken = await getAssetIdByAccount(api, accountId.value)
//   currentAsset.value = currentToken
// }

watch(
  () => accountId.value,
  async () => {
    await loadAssets()
  },
  { immediate: true }
)
</script>
