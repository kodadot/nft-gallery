<script>
import { OInput } from '@oruga-ui/oruga'

export default {
  mixins: [OInput],
  computed: {
    rootClasses() {
      return [
        'neo-input',
        this.computedClass('rootClass', 'o-ctrl-input'),
        {
          [this.computedClass('expandedClass', 'o-ctrl-input--expanded')]:
            this.expanded,
        },
      ]
    },
  },
}
</script>

<style lang="scss">
@import './NeoInput.scss';
</style>
