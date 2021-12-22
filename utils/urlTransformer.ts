type URLParams = string[]
type TransformFunction = (params: URLParams) => string
type Transformer = Record<string, TransformFunction>

const getParams = (url: URL): string[] => url.pathname.split('/').filter(Boolean)

const lastParam = (params: URLParams): string => params[params.length - 1]

const getTransformer = (url: URL): Transformer => availableTranformers[url.host]

const isTransformer = (transformer?: Transformer): boolean => transformer !== undefined

function transform(url: string): string {
  try {
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
  } catch (e) {
    return ''
  }
}

const singularTransformer: Transformer = {
  space: (params: URLParams) => `/rmrk/u/${lastParam(params)}`,
  collections: (params: URLParams) => `/rmrk/collection/${lastParam(params)}`,
  collectibles: (params: URLParams) => `/rmrk/detail/${lastParam(params)}`,
}

const availableTranformers: Record<string, Transformer> = {
  'singular.rmrk.app': singularTransformer,
}

export default transform
