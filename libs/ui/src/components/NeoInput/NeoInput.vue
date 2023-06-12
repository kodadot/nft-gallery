<script lang="ts">
import { OInput } from '@oruga-ui/oruga'

export default {
  mixins: [OInput],
  computed: {
    rootClasses() {
      return ['neo-input', 'o-ctrl-input']
    },
    iconPack() {
      return 'fas'
    },
  },
}
</script>

<style lang="scss">
@import './NeoInput.scss';
</style>
