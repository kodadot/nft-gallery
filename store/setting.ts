import { OverrideSettingModule } from '@vue-polkadot/vue-settings'

const defaultApiUrl = process.env.VUE_APP_WS_URL ? { apiUrl: process.env.VUE_APP_WS_URL } : {}
const SettingModule = OverrideSettingModule(defaultApiUrl)

// Disabling namespace to match with the original repo
export const namespaced = false

export const state = () => SettingModule.state

export const actions = SettingModule.actions

export const mutations = SettingModule.mutations

export const getters = SettingModule.getters
