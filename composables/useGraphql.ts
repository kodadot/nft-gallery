import resolveQueryPath from '@/utils/queryPathResolver'
import { notificationTypes, showNotification } from '@/utils/notification'
import type { QueryOptions } from 'apollo-client'
import { ComputedRef } from 'vue'

interface DoFetchParams {
  options?: Omit<QueryOptions, 'query'>
  variables?: Record<string, unknown>
}

export const useQueryParams = ({
  queryPrefix,
  clientName = '',
}: {
  queryPrefix: string
  clientName?: string | ComputedRef<string>
}) => {
  const { client } = usePrefix()

  return {
    prefix: queryPrefix || client.value,
    client: clientName || client.value,
  }
}

export default function ({
  queryPrefix = '',
  queryName,
  clientName = '',
  variables = {},
  // options = {},
  disabled = computed(() => false),
  data = ref(),
  error = ref(),
  loading = ref(true),
}) {
  const { $consola } = useNuxtApp()
  const { prefix, client } = useQueryParams({ queryPrefix, clientName })

  async function doFetch({
    // options: extraOptions = {},
    variables: extraVariables = {},
  }: DoFetchParams = {}) {
    const query = await resolveQueryPath(prefix, queryName)

    try {
      const { data: result } = await useAsyncQuery({
        query: query.default,
        variables: {
          ...variables,
          ...extraVariables,
        },
        clientId: isRef(client) ? String(client.value) : client,
        // ...options,
        // ...extraOptions,
      })
      data.value = result
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
      options: {
        fetchPolicy: 'network-only',
      },
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
