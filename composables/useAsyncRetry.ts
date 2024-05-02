type Item = {
  id: string
  promise: () => Promise<any>
}

export default (retryCount: number = 3) => {
  const states = ref(
    new Map<string, { tries: number; fulfilled: boolean; response?: any }>(),
  )

  const stateValues = computed(() =>
    Object.values(Object.fromEntries(states.value.entries())),
  )

  const triedAll = computed<boolean>(
    () =>
      Boolean(stateValues.value.length) &&
      stateValues.value.every((item) => item.tries === 0),
  )

  const fulfilledAll = computed<boolean>(
    () =>
      Boolean(stateValues.value.length) &&
      stateValues.value.every((item) => item.fulfilled),
  )

  const completed = computed<boolean>(
    () =>
      Boolean(stateValues.value.length) &&
      stateValues.value.every((item) => item.fulfilled || item.tries === 0),
  )

  const getDefaultState = () => ({
    tries: retryCount,
    fulfilled: false,
  })

  const tryItem = async (item: Item) => {
    const currentState = states.value.get(item.id) || getDefaultState()

    if (currentState.tries > 0 && !currentState.fulfilled) {
      try {
        const response = await item.promise()
        states.value.set(item.id, {
          tries: currentState.tries,
          fulfilled: true,
          response,
        })
      } catch (error) {
        states.value.set(item.id, {
          tries: currentState.tries - 1,
          fulfilled: false,
        })
        await tryItem(item)
      }
    }
  }

  return {
    tryItem,
    completed,
    triedAll,
    fulfilledAll,
  }
}
