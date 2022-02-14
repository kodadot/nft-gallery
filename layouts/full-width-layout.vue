<template>
  <div class="min-h-full is-flex is-flex-direction-column">
    <Navbar v-if="isNavbarVisible" />
    <main class="is-flex-grow-1">
      <Nuxt />
    </main>
    <Footer />
    <KeyboardShortcutsModal />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import isShareMode from '@/utils/isShareMode'

@Component<Dashboard>({
  components: {
    KeyboardShortcutsModal: () =>
      import('@/components/shared/modals/keyboardShortcutsModal.vue'),
  },
})
export default class Dashboard extends Vue {
  get isNavbarVisible() {
    return !isShareMode
  }
}
</script>
