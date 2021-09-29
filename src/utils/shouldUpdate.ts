function shouldUpdate<T = string>(val: T, oldVal: T) {
  return val && val !== oldVal
}

export default shouldUpdate
