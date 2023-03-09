import { defineStore } from 'pinia'

interface State {
  visitedOnboarding: boolean
}
const localStorage = useLocalStorage('massmint', { visitedOnboarding: false })

export const useMassmintsStore = defineStore('massmint', {
  state: (): State => ({
    visitedOnboarding: localStorage.value.visitedOnboarding,
  }),
  getters: {
    getVisitedOnboarding: ({ visitedOnboarding }) => ({ visitedOnboarding }),
  },
  actions: {
    setVisitedOnboarding(payload: boolean) {
      this.visitedOnboarding = payload
      localStorage.value = { visitedOnboarding: payload }
    },
  },
})
