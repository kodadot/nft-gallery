import type { ComputedRef } from 'vue'

type Variables = Record<string, unknown>

type UseGraphqlParams = {
  queryName: string
  queryPrefix?: string
  clientName?: MaybeRef<string>
  variables?: MaybeRef<Variables>
  disabled?: ComputedRef<boolean>
}

export default function<T = unknown>({
  queryName,
  queryPrefix,
  clientName,
  variables = {},
  disabled = computed(() => false),
}: UseGraphqlParams) {
  const currentRequestId = ref(0) // simple solution to ensure only the latest query result updates the state.
  const loading = ref(true)
  const data = ref()

  const { client: clientPrefix } = usePrefix()
  const { $consola } = useNuxtApp()
  const prefix = queryPrefix || clientPrefix.value
  const queryKey = computed(() => [prefix, queryName, JSON.stringify(cloneRawObject(variables))].join('-'))
  const enabled = computed(() => !unref(disabled))

  const doFetch = async (variables: Variables) => {
    try {
      loading.value = true
      const requestId = ++currentRequestId.value

      const response = await useAsyncGraphql<T>({
        query: queryName,
        variables,
        clientId: clientName ? unref(clientName) : undefined,
        prefix: prefix,
      })

      if (currentRequestId.value === requestId) {
        data.value = response.data.value
      }
    }
    catch (err) {
      dangerMessage(`${err as string}`)
      $consola.error(err)
    }
    finally {
      loading.value = false
    }
  }

  const refetch = async ({ variables: extraVariables, override = false }: {
    variables?: Variables
    override?: boolean
  } = {}) => {
    await doFetch(
      {
        ...(override ? {} : cloneRawObject(variables)),
        ...extraVariables,
      },
    )
  }

  watch([enabled, queryKey], async ([enabled]) => {
    if (enabled) {
      await doFetch(cloneRawObject(variables))
    }
  }, { immediate: true })

  return {
    data,
    refetch,
    loading,
  }
}
