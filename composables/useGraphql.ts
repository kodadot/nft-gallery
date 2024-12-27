import type { ComputedRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'

type Variables = Record<string, unknown>

interface DoFetchParams {
  variables?: Variables
  override?: boolean
}

type UseGraphqlParams = {
  queryPrefix?: string
  queryName: string
  clientName?: MaybeRef<string>
  variables?: MaybeRef<Variables>
  disabled?: ComputedRef<boolean>
}

export default function<T = unknown>({
  queryName,
  queryPrefix,
  clientName,
  variables: queryVariables = {},
  disabled = computed(() => false),
}: UseGraphqlParams) {
  const variables = ref()
  const { client: clientPrefix } = usePrefix()
  const { $consola } = useNuxtApp()

  const prefix = queryPrefix || clientPrefix.value

  const { data, refetch: refetchQuery, isLoading: loading } = useQuery({
    queryKey: [prefix, queryName, computed(() => JSON.stringify(variables.value))],
    enabled: computed(() => !unref(disabled) && Boolean(variables.value)),
    queryFn: async () => {
      try {
        const response = await useAsyncGraphql<T>({
          query: queryName,
          variables: variables.value,
          clientId: clientName ? unref(clientName) : undefined,
          prefix: prefix,
        })

        return response.data.value
      }
      catch (err) {
        dangerMessage(`${err as string}`)
        $consola.error(err)
      }
    },
  })

  const doFetch = async ({ variables: extraVariables, override = false }: DoFetchParams = {}) => {
    variables.value = {
      ...(override ? {} : cloneRawObject(queryVariables)),
      ...extraVariables,
    }
    refetchQuery()
  }

  const refetch = async (variables?: Variables) => {
    await doFetch({ variables })
  }

  watchEffect(() => {
    if (!disabled.value) {
      variables.value = cloneRawObject(queryVariables)
    }
  })

  return {
    data,
    refetch,
    loading,
  }
}
