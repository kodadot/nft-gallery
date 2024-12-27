import type { ComputedRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'

type Variables = Record<string, unknown>

interface DoFetchParams {
  variables?: Variables
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
  queryPrefix = undefined,
  clientName = undefined,
  variables = {},
  disabled = computed(() => false),
}: UseGraphqlParams) {
  const { client: clientPrefix } = usePrefix()
  const { $consola } = useNuxtApp()

  const prefix = queryPrefix || clientPrefix.value

  const queryVariables = ref()
  const enabled = computed(() => !unref(disabled) && Boolean(queryVariables.value))

  const { data, refetch: refetchQuery, isLoading: loading } = useQuery({
    queryKey: [prefix, queryName, computed(() => JSON.stringify(queryVariables.value))],
    queryFn: async () => {
      try {
        return (await useAsyncGraphql<T>({
          query: queryName,
          variables: queryVariables.value,
          clientId: clientName ? unref(clientName) : undefined,
          prefix: prefix,
        })).data.value
      }
      catch (err) {
        dangerMessage(`${err as string}`)
        $consola.error(err)
      }
    },
    enabled,
  })

  const doFetch = async ({ variables: extraVariables }: DoFetchParams = {}) => {
    queryVariables.value = { ...unref(variables), ...extraVariables }
    refetchQuery()
  }

  const refetch = async (variables?: Variables) => {
    await doFetch({ variables })
  }

  watchEffect(() => {
    if (!disabled.value) {
      queryVariables.value = structuredClone(toRaw(unref(variables)))
    }
  })

  return {
    data,
    refetch,
    loading,
  }
}
