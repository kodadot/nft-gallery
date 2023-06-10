export function useModelWrapper<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Props extends Readonly<any>,
  Key extends string
>(
  props: Props,
  emit: { (event: `update:${Key}`, ...args: Props[Key][]): void },
  name = 'modelValue' as Key
) {
  return computed({
    get: (): Props[Key] => props[name],
    set: (value: Props[Key]) => emit(`update:${name}`, value),
  })
}
