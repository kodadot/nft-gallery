// plugins/urql.ts
import urql, {
  cacheExchange,
  fetchExchange,
} from '@urql/vue'
import { defineNuxtPlugin } from '#app'
import { URLS } from '~/utils/constants'

export default defineNuxtPlugin((nuxtApp) => {
  const GRAPHQL_ENDPOINTS = {
    ahp: URLS.koda.speck,
    ahk: URLS.koda.stick,
  }

  nuxtApp.vueApp.use(urql, {
    url: GRAPHQL_ENDPOINTS.ahp,
    exchanges: [
      cacheExchange,
      fetchExchange,
    ],
    fetch: (input: RequestInfo | URL, init?: RequestInit) => {
      // Try to parse the request body to extract variables
      const customInit = init as any
      let clientKey = null

      if (customInit?.body) {
        try {
          const body = JSON.parse(customInit.body)
          // Extract client from variables
          clientKey = body.variables?.__client

          // Remove our custom property from variables
          if (clientKey && body.variables) {
            delete body.variables.__client
            // Update the request body
            customInit.body = JSON.stringify(body)
          }
        }
        catch (e) {
          // Ignore parsing errors
        }
      }

      const targetUrl = clientKey && GRAPHQL_ENDPOINTS[clientKey] ? GRAPHQL_ENDPOINTS[clientKey] : input

      return fetch(targetUrl, init || {})
    },
  })
})
