import { createStore } from 'idb-keyval'

export const identityStore = createStore('identity', 'keyval')
