<template>
  <component
    :is="imageComponent"
    v-bind="attrs"
  />
</template>

<script lang="ts" setup>
import type {
  ComputedOptions,
  ConcreteComponent,
  ImgHTMLAttributes,
  MethodOptions,
} from 'vue'

export type ImageComponent =
  | 'img'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  | ConcreteComponent<{}, any, any, ComputedOptions, MethodOptions>
  | string
export type ImageComponentProps = Record<string, unknown>

interface Props extends /* @vue-ignore */ ImgHTMLAttributes {
  imageComponent?: ImageComponent
  imageComponentProps?: ImageComponentProps
}

const props = withDefaults(defineProps<Props>(), {
  imageComponent: 'img',
  imageComponentProps() {
    return {}
  },
})

const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const clone = { ...obj } as const

  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  keys.forEach(key => delete clone[key])
  return clone
}

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
