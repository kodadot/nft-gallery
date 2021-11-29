

type URLParams = string[]
type TransformFunction = (params: URLParams) => string
type Transformer = Record<string, TransformFunction>

function transform(url: string): string {
  const value = new URL(url)

  const transformer = getTransformer(value)

  if (!isTransformer(transformer)) {
    return url
  }

  const params = getParams(value)
  const fn = transformer[params[0]] // TODO: only works for singular

  if (!fn) {
    return url
  }

  return fn(params)
}

function getParams(url: URL): string[] {
  return url.pathname.split('/').filter(Boolean)
}

const getTransformer = (url: URL): Transformer => {
  return availableTranformers[url.host]
}

const isTransformer = (transformer?: any): boolean => transformer !== undefined

function lastParam(params: URLParams): string {
  return params[params.length - 1]
}

const singularTransformer: Transformer = {
  space: (params: URLParams) => `/rmrk/u/${lastParam(params)}`,
  collections: (params: URLParams) => `/rmrk/collection/${lastParam(params)}`,
  collectibles: (params: URLParams) => `/rmrk/detail/${lastParam(params)}`,
}

const availableTranformers: Record<string, Transformer> = {
  'singular.rmrk.app': singularTransformer
}


export default transform

