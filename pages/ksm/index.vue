<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class LandingPage extends Vue {
  layout() {
    return 'full-width-layout'
  }

  middleware({ store, redirect }) {
    // If the user is not authenticated
    const prefix = store.getters.currentUrlPrefix
    if (prefix !== 'ksm') {
      this.$consola.log('Not KSM/RMRK2')
      store.dispatch('setUrlPrefix', 'ksm')
    }
    setTimeout(() => redirect('/'))
  }
}
</script>
