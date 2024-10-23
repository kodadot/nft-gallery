export const fetchGraphql = async (query: string, { client }: { client?: string } = {}) => {
  const httpUrl = apolloClientConfig[client || usePrefix().client.value]?.httpEndpoint as string

  return $fetch(httpUrl, {
    method: 'POST',
    body: {
      query: `
      query {
        ${query}
      }
    `,
    },
  })
}
