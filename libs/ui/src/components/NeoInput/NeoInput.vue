<script lang="ts">
import { OInput } from '@oruga-ui/oruga'

export default {
  mixins: [OInput],
  computed: {
    rootClasses() {
      return ['neo-input']
    },
  },
}
</script>

<style lang="scss">
@import './NeoInput.scss';
</style>
