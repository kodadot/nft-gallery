import type { ComputedRef } from 'vue'
import resolveQueryPath from '@/utils/queryPathResolver'

interface DoFetchParams {
  variables?: Record<string, unknown>
}

type UseGraphqlParams<T> = {
  queryPrefix?: string
  queryName: string
  clientName?: string | ComputedRef<string>
  variables?: MaybeRef<Record<string, unknown>>
  disabled?: ComputedRef<boolean>
  data?: Ref<T | undefined>
  error?: Ref<unknown>
  loading?: Ref<boolean>
}

export default function<T = unknown>({
  queryPrefix = '',
  queryName,
  clientName = '',
  variables = {},
  disabled = computed(() => false),
  data = ref<T>(),
  error = ref(),
  loading = ref(true),
}: UseGraphqlParams<T>) {
  const dynamicVariablesWatcher = ref()
  const fetched = ref(false)

  const { client: clientPrefix } = usePrefix()
  const { $consola } = useNuxtApp()

  const prefix = queryPrefix || clientPrefix.value
  const client = clientName || clientPrefix.value

  async function doFetch({
    variables: extraVariables = {},
  }: DoFetchParams = {}) {
    const query = await resolveQueryPath(prefix, queryName)

    try {
      loading.value = true
      const { data: result } = await useAsyncQuery<T>({
        query: query.default,
        variables: {
          ...unref(variables),
          ...extraVariables,
        },
        clientId: unref(client),
      })
      data.value = result.value
      fetched.value = true
    }
    catch (err) {
      ;(error.value as unknown) = err
      dangerMessage(`${err as string}`)
      $consola.error(err)
    }
    finally {
      loading.value = false
    }
  }

  async function refetch(variables: Record<string, unknown> = {}) {
    await doFetch({
      variables,
    })
  }

  const watchRefVariables = () => {
    if (!dynamicVariablesWatcher.value) {
      dynamicVariablesWatcher.value = watchEffect(() => {
        if (!disabled.value) {
          refetch(unref(variables))
        }
      })
    }
  }

  const fetchWatcher = watchEffect(() => {
    if (fetched.value) {
      return fetchWatcher()
    }

    if (isRef(variables)) {
      watchRefVariables()
    }
    else if (!disabled.value) {
      doFetch()
    }
  })

  return {
    data,
    error,
    refetch,
    loading,
  }
}
