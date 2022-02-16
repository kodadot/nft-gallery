import Vue from 'vue'

declare type Unsubscribe = () => void

export interface SubscriptionStruct {
  balanceSub: Unsubscribe
}

const defaultState: SubscriptionStruct = {
  balanceSub: () => void 0,
}

// Disabling namespace to match with the original repo
export const namespaced = false

export const state = () => defaultState

export const mutations = {
  addSubscription(state: SubscriptionStruct, { key, sub }): void {
    // unsubscribe previous subsription
    const oldSub = state[key]
    oldSub()

    // set new subscription
    Vue.set(state, key, sub)
  },
}

export const actions = {
  setSubscription({ commit }, payload): void {
    commit('addSubscription', payload)
  },
}

export const getters = {
  getBalanceSub(state: SubscriptionStruct): Unsubscribe {
    return state.balanceSub
  },
}
