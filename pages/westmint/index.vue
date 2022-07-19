<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class LandingPage extends Vue {
  layout() {
    return 'full-width-layout'
  }

  middleware({ store, route, redirect }) {
    const prefix = store.getters.currentUrlPrefix
    if (prefix !== route.name) {
      this.$consola.log('[EXPECT]', route.name, 'got', prefix)
      store.dispatch('setUrlPrefix', route.name)
    }
    setTimeout(() => redirect('/'))
  }
}
</script>
