import type { ComputedRef } from 'vue'
import resolveQueryPath from '@/utils/queryPathResolver'
import { notificationTypes, showNotification } from '@/utils/notification'

interface DoFetchParams {
  variables?: Record<string, unknown>
}

type UseGraphqlParams<T> = {
  queryPrefix?: string
  queryName: string
  clientName?: string | ComputedRef<string>
  variables?: Record<string, unknown> | ComputedRef<Record<string, unknown>>
  disabled?: ComputedRef<boolean>
  data?: Ref<T | undefined>
  error?: Ref<unknown>
  loading?: Ref<boolean>
}

export default function <T = unknown>({
  queryPrefix = '',
  queryName,
  clientName = '',
  variables = {},
  disabled = computed(() => false),
  data = ref<T>(),
  error = ref(),
  loading = ref(true),
}: UseGraphqlParams<T>) {
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
          ...variables,
          ...extraVariables,
        },
        clientId: isRef(client) ? String(client.value) : client,
      })
      data.value = result.value
    } catch (err) {
      ;(error.value as unknown) = err
      showNotification(`${err as string}`, notificationTypes.danger)
      $consola.error(err)
    } finally {
      loading.value = false
    }
  }

  async function refetch(variables: Record<string, unknown> = {}) {
    await doFetch({
      variables,
    })
  }

  if (!disabled.value) {
    if (isRef(variables)) {
      watchEffect(() => doFetch())
    } else {
      doFetch()
    }
  }

  return {
    data: data,
    error,
    refetch,
    loading,
  }
}
