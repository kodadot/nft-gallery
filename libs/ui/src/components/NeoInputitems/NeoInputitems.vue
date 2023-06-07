<script lang="ts">
import { OInputitems } from '@oruga-ui/oruga'

export default {
  mixins: [OInputitems],
  computed: {
    rootClasses() {
      return ['neo-inputitems']
    },
  },
}
</script>

<style lang="scss">
@import './NeoInputitems.scss';
</style>
