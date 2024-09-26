import resolveQueryPath from '@/utils/queryPathResolver'

type AyncQueryParams = {
  query: string
  variables: Record<string, unknown>
  clientId?: string
}

export default async function ({ query, clientId, variables }: AyncQueryParams) {
  return useAsyncQuery({
    query: (await resolveQueryPath(clientId || usePrefix().client.value, query)).default,
    variables: variables,
    clientId: clientId,
  })
}
