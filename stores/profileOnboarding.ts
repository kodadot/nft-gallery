import { defineStore } from 'pinia'

export interface ProfileOnboardingState {
  onboardingShown: boolean
  sidebarToggled: boolean
  carouselVisited: boolean
}

export const useProfileOnboardingStore = defineStore('profileOnboarding', {
  state: (): ProfileOnboardingState => ({
    onboardingShown: false,
    sidebarToggled: false,
    carouselVisited: false,
  }),
  getters: {
    getShouldShowOnboarding: (state) => {
      const { accountId } = useAuth()
      return accountId.value && !state.onboardingShown && state.sidebarToggled && state.carouselVisited
    },
    getIsOnboardingShown: state => state.onboardingShown,
  },
  actions: {
    setOnboardingShown() {
      this.onboardingShown = true
    },
    setSidebarToggled() {
      this.sidebarToggled = true
    },
    setCarouselVisited() {
      this.carouselVisited = true
    },
  },
})
