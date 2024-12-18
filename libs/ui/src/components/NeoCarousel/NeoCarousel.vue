<script lang="ts">
import { OCarousel } from '@oruga-ui/oruga-next'

export default {
  extends: OCarousel,
  props: {
    iconPack: {
      type: String,
      default: 'fasr',
    },
  },
}
</script>
