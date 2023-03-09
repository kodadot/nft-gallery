import { createPinia, defineStore } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
// const STORAGE_KEY = 'massmint'

interface State {
  visitedOnboarding: boolean
}

const pinia = createPinia()
pinia.use(piniaPersist)

export const useMassmintsStore = defineStore('massmint', {
  state: (): State => ({
    visitedOnboarding: false,
  }),
  getters: {
    getVisitedOnboarding: ({ visitedOnboarding }) => ({ visitedOnboarding }),
  },
  actions: {
    setVisitedOnboarding(payload) {
      this.visitedOnboarding = payload
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'massmint',
        storage: localStorage,
      },
    ],
  },
})
