import resolveQueryPath from '@/utils/queryPathResolver'

type AyncQueryParams = {
  query: string
  variables: Record<string, unknown>
  clientId?: string
  prefix?: string
}

export default async function ({ query, variables, clientId, prefix }: AyncQueryParams) {
  const { urlPrefix, client } = usePrefix()

  return useAsyncQuery({
    query: (await resolveQueryPath(prefix || urlPrefix.value, query)).default,
    variables: variables,
    clientId: clientId || client.value,
  })
}
