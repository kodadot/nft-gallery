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

<script lang="ts">
import assetListByIdList from '@/queries/subsquid/bsx/assetListByIdList.graphql'
import { setDefaultFeeToken } from '@/utils/api/bsx/extrinsics'
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import {
  getAssetIdByAccount,
  getAsssetBalance,
  getKusamaAssetId,
} from '@/utils/api/bsx/query'
import { useApollo } from '@/utils/config/useApollo'
import { mapToId } from '@/utils/mappers'
import AuthMixin from '@/utils/mixins/authMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import shouldUpdate from '@/utils/shouldUpdate'
import { AssetItem, AssetListQueryResponse } from './types'

@Component({
  components: {
    Loader: () => import('@/components/shared/Loader.vue'),
    AssetTable: () => import('@/components/bsx/Asset/AssetTable.vue'),
  },
})
export default class AssetList extends mixins(
  AuthMixin,
  PrefixMixin,
  MetaTransactionMixin
) {
  protected assetList: AssetItem[] = []
  protected currentAsset = '0'

  private async loadAssets() {
    try {
      const { assetList } = await useApollo<this, AssetListQueryResponse>(
        this.$apollo,
        this.client,
        assetListByIdList,
        {
          ids: ['0', getKusamaAssetId(this.client)],
        }
      )
      this.assetList = assetList
      this.fetchAccountBalance()
    } catch (e) {
      this.$consola.warn(e)
      showNotification('Unable to load assets')
    }
  }

  private async fetchAccountBalance() {
    const api = await this.useApi()
    const mapper = (id: string) => getAsssetBalance(api, this.accountId, id)
    this.assetList.map(mapToId).map(mapper).forEach(this.updatedBalanceFor)
  }

  private async updatedBalanceFor(balance: Promise<string>, index: number) {
    try {
      this.$set(this.assetList, index, {
        ...this.assetList[index],
        balance: await balance,
      })
    } catch (e) {
      console.warn('Unable to fetch balance', e)
    }
  }

  private async fetchCurrentToken(): Promise<void> {
    const api = await this.useApi()
    const currentToken = await getAssetIdByAccount(api, this.accountId)
    this.currentAsset = currentToken
  }

  protected async handleTokenSelect(id: string) {
    const api = await this.useApi()
    const { call, args } = setDefaultFeeToken(api, id)
    this.initTransactionLoader()
    this.howAboutToExecute(this.accountId, call, args, (blockNumber) => {
      showNotification(
        `[ASSET] Since block ${blockNumber}, you pay in different token`,
        notificationTypes.success
      )
      this.fetchCurrentToken()
      this.fetchAccountBalance()
    })
  }

  @Watch('accountId', { immediate: true })
  public onAccountIdChange(value: string, oldValue: string) {
    console.log('onAccountIdChange', value, oldValue)
    if (shouldUpdate(value, oldValue)) {
      this.loadAssets()
      this.fetchCurrentToken()
    }
  }
}
</script>
