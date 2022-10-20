import SettingModule from '@kodadot1/vuex-options'

// console.log(process.env.VUE_APP_WS_URL, process.env.NUXT_ENV_WS_URL)

// const defaultApiUrl = process.env.NUXT_ENV_WS_URL ? { apiUrl: process.env.NUXT_ENV_WS_URL } : {}
// const SettingModule = OverrideSettingModule(defaultApiUrl)

// Disabling namespace to match with the original repo
export const namespaced = false

export const state = () => SettingModule.state

export const actions = SettingModule.actions

export const mutations = SettingModule.mutations

export const getters = SettingModule.getters
