type Item = {
  id: string
  promise: () => Promise<any>
}

export default (retryCount: number = 3) => {
  const states = ref(
    new Map<string, { tries: number; completed: boolean; response?: any }>(),
  )

  const stateValues = computed(() =>
    Object.values(Object.fromEntries(states.value.entries())),
  )

  const triedAll = computed(
    () =>
      stateValues.value.length &&
      Number(getSumOfObjectField(stateValues.value, 'tries')) === 0,
  )

  const completedAll = computed(() => {
    const loaded = stateValues.value.map((item) => item.completed)
    return loaded.length && loaded.every(Boolean)
  })

  const getDefaultState = () => ({
    tries: retryCount,
    completed: false,
  })

  const tryItem = async (item: Item) => {
    const currentState = states.value.get(item.id) || getDefaultState()

    if (currentState.tries > 0 && !currentState.completed) {
      try {
        const response = await item.promise()
        states.value.set(item.id, {
          tries: currentState.tries,
          completed: true,
          response,
        })
      } catch (error) {
        states.value.set(item.id, {
          tries: currentState.tries - 1,
          completed: false,
        })
        await tryItem(item)
      }
    }
  }

  return {
    tryItem,
    completedAll,
    triedAll,
  }
}
