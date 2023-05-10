export type StringOrNull = string | null

export const exist = (
  value: string | StringOrNull[],
  cb: (arg: string) => void
): void => {
  if (value && typeof value === 'string') {
    cb(value)
  }
}

export const existArray = (
  value: string[],
  cb: (arg: string[]) => void
): void => {
  if (value && value.length) {
    cb(value)
  }
}
