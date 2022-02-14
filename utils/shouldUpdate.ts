function shouldUpdate<T = string>(val: T, oldVal: T): boolean {
  return val && val !== oldVal
}

export default shouldUpdate
