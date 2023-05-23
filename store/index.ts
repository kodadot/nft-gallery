import { Store } from 'vuex'
import { useIdentityStore } from '@/stores/identity'
import { ss58Of } from '@/utils/config/chain.config'

type VuexAction = {
  type: string
  payload: string
}

const formatPlugin = (store: Store<null>): void => {
  store.subscribeAction(({ type, payload }: VuexAction) => {
    if (type === 'setUrlPrefix' && payload) {
      const identityStore = useIdentityStore()
      identityStore.setCorrectAddressFormat(ss58Of(payload))
      if (['snek', 'bsx'].includes(payload)) {
        store.dispatch('assets/fetchAssetList', payload)
      }
    }
  })
}
export const plugins = [formatPlugin]
