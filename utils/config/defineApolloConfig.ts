import { APOLLO_ENDPOINTS } from '@/libs/static'

type Endpoint = {
  httpEndpoint: string
}

const toClient = (value: string): string => {
  switch (value) {
    case 'kusama':
      return 'rmrk'
    case 'rmrk':
      return 'ksm'
    default:
      return value
  }
}

export const toApolloEndpoint = (httpEndpoint: string): Endpoint => ({
  httpEndpoint,
})

export default () => APOLLO_ENDPOINTS
