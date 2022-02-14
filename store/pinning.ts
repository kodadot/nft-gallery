import { GetterTree, ActionTree, MutationTree, Commit } from 'vuex'
import { PinningKey, getKey as getPinningKey } from '@/utils/pinning'
import { emptyObject, isEmpty } from '@/utils/empty'

type PinningState = {
  pinningKey: PinningKey,
}

export const state = (): PinningState => ({
  pinningKey: emptyObject<PinningKey>(),
})


export const getters: GetterTree<PinningState, PinningState> = {
  getPinningKey: (state) => state.pinningKey?.token,
  isKeyValid: (state) => !!state.pinningKey?.expiry && new Date(state.pinningKey.expiry).getTime() < Date.now(),
}

export const mutations: MutationTree<PinningState> = {
  SET_PINNING_KEY(state, data: PinningKey) {
    state.pinningKey = Object.assign({}, state.pinningKey, data)
  },
}

export const actions: ActionTree<PinningState, PinningState> = {
  async fetchPinningKey({ commit, state }: { commit: Commit, state: PinningState }, address: string): Promise<PinningKey> {
    if (isEmpty(state.pinningKey) || isExpired(state.pinningKey)) {
      const pinningKey = await getPinningKey(address)
      commit('SET_PINNING_KEY', pinningKey)
      return pinningKey
    }

    return state.pinningKey
  },
}

const isExpired = (pinningKey: PinningKey) => {
  if (pinningKey.expiry) {
    const expiry = new Date(pinningKey.expiry)
    return expiry.getTime() < Date.now()
  }

  return false
}
