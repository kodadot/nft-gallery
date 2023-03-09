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
    const prefix = store.getters.currentUrlPrefix

    setTimeout(() => redirect(`/${prefix}/massmint/onboarding`))
  }
}
</script>
