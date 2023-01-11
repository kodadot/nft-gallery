import { createClient } from 'graphql-ws'
import { getWSUrlByClient } from '@/utils/websocket'

export default function ({
  clientName = '',
  query,
  onChange,
  onError,
}: {
  clientName?: string
  query: string
  onChange: (data) => void
  onError?: (error) => void
}) {
  const { client: prefixClient } = usePrefix()
  const { $consola } = useNuxtApp()
  const client = clientName || prefixClient.value
  const wsUrl = getWSUrlByClient(client)

  if (!wsUrl) {
    // this client do not subscription
    return
  }

  const wsClient = createClient({
    url: wsUrl,
  })
  wsClient.subscribe(
    {
      query: `
          subscription {
            ${query}
          }
          `,
      /**
       * For each entity types, the following queries are supported for subscriptions:
       * ${EntityName}ById -- query a single entity
       * ${EntityName}s -- query multiple entities with a where filter
       * ref: https://docs.subsquid.io/develop-a-squid/graphql-api/subscriptions/
       */
    },
    {
      next: (data) => {
        $consola.log(`ws subscription: New changes: ${JSON.stringify(data)}`)
        onChange(data)
      },
      error: (error) => {
        $consola.error('ws subscription: error', error)
        onError && onError(error)
      },
      complete: () => {
        $consola.log('ws subscription: done!')
      },
    }
  )
}
