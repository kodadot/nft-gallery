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
    if (prefix !== 'moonsama') {
      this.$consola.log('Not Moonsama')
      store.dispatch('setUrlPrefix', 'moonsama')
    }
    setTimeout(() => redirect('/'))
  }
}
</script>
