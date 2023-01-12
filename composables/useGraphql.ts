import resolveQueryPath from '@/utils/queryPathResolver'
import { notificationTypes, showNotification } from '@/utils/notification'

const useQueryParams = ({ queryPrefix, clientName }) => {
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
  options = {},
  data = ref(),
  error = ref(),
  loading = ref(true),
}) {
  const { $apollo, $consola } = useNuxtApp()
  const { prefix, client } = useQueryParams({ queryPrefix, clientName })

  async function doFetch() {
    const query = await resolveQueryPath(prefix, queryName)

    try {
      const response = await $apollo.query({
        query: query.default,
        client: client,
        variables,
        ...options,
      })
      data.value = response.data
    } catch (err) {
      ;(error.value as unknown) = err
      showNotification(`${err as string}`, notificationTypes.danger)
      $consola.error(err)
    } finally {
      loading.value = false
    }
  }

  if (isRef(variables)) {
    watchEffect(doFetch)
  } else {
    doFetch()
  }

  return {
    data,
    error,
    refetch: doFetch,
    loading,
  }
}
