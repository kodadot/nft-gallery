import { Prefix } from './types'

type AvailableClient = 'subquery' | 'subsquid'

type DefaultIndexer = Record<Prefix, AvailableClient>

type ImplementationAvailable = Record<Prefix, [boolean, boolean]> // [subquery, subsquid]

// const defaultIndexer: DefaultIndexer = {
//   rmrk: 'subquery',
//   bsx: 'subsquid',
//   statemine: 'subquery',
//   westmint: 'subquery',
// }

// const implementationAvailable: ImplementationAvailable = {
//   rmrk: [true, true],
//   bsx: [false, true],
//   statemine: [true, false],
//   westmint: [true, false],
// }

// function getDefaultIndexer(prefix: Prefix) {
//   return defaultIndexer[prefix]
// }

// function indexOf(client: AvailableClient): 0 | 1 {
//   return client === 'subsquid' ? 1 : 0
// }
