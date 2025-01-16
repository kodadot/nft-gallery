const BASE_URL = 'https://cors-proxy.kodadot.workers.dev/'

export const getCorsProxiedUrl = (url: string): string => {
  return `${BASE_URL}/?url=${encodeURIComponent(url)}`
}
