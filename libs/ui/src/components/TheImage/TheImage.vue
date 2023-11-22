<template>
  <component :is="imageComponent" v-bind="attrs" />
</template>

<script lang="ts" setup>
import type {
  ComputedOptions,
  ConcreteComponent,
  ImgHTMLAttributes,
  MethodOptions,
  ReservedProps,
} from 'vue'
import omit from 'lodash/omit'

export type ImageComponent =
  | 'img'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  | ConcreteComponent<{}, any, any, ComputedOptions, MethodOptions>
  | string
export type ImageComponentProps = Record<string, unknown>

interface Props extends /* @vue-ignore */ ImgHTMLAttributes, ReservedProps {
  imageComponent?: ImageComponent
  imageComponentProps?: ImageComponentProps
}

const props = withDefaults(defineProps<Props>(), {
  imageComponent: 'img',
  imageComponentProps() {
    return {}
  },
})

const attrs = computed(() => {
  const imgAttrs = omit(props, ['imageComponent', 'imageComponentProps'])

  if (props.imageComponent === 'img') {
    return imgAttrs
  }

  return {
    ...imgAttrs,
    ...props.imageComponentProps,
  }
})
</script>
