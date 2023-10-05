<script>
import { OField } from '@oruga-ui/oruga-next'

export default {
  mixins: [OField],
  computed: {
    classes() {
      return [
        'neo-field',
        this.computedClass('rootClass', 'o-field'),
        {
          [this.computedClass('horizontalClass', 'o-field--horizontal')]:
            this.horizontal,
        },
        {
          [this.computedClass('mobileClass', 'o-field--mobile')]:
            this.isMatchMedia,
        },
        {
          [this.computedClass('focusedClass', 'o-field--focused')]:
            this.isFocused,
        },
        {
          [this.computedClass('filledClass', 'o-field--filled')]: this.isFilled,
        },
      ]
    },
  },
}
</script>

<style lang="scss">
@import './NeoField.scss';
</style>
