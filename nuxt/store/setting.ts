import setting from '@vue-polkadot/vue-settings'

// Disabling namespace to match with the original repo
export const namespaced = false

export const state = () => setting.state

export const actions = setting.actions

export const mutations = setting.mutations

export const getters = setting.getters