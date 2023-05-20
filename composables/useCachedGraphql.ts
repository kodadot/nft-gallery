import resolveQueryPath from '@/utils/queryPathResolver'
import { useQuery } from '@tanstack/vue-query'

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
}) {
  const { $apollo, $consola } = useNuxtApp()
  const { prefix, client } = useQueryParams({ queryPrefix, clientName })

  const fetcher = async () => {
    try {
      const query = await resolveQueryPath(prefix, queryName)
      const result = await $apollo.query({
        query: query.default,
        client: client,
        variables,
        ...options,
      })

      return result.data
    } catch (error) {
      $consola.error(error)
      throw error
    }
  }

  function doFetch<T>() {
    const variablesId = Object.values(variables).join()
    const queryResult = useQuery<T>([prefix, queryName, variablesId], fetcher)

    if (queryResult.isError) {
      $consola.error(queryResult.error)
    }
    return queryResult
  }

  return doFetch
}
