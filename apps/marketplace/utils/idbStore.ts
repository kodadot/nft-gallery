import { createStore } from 'idb-keyval'

export const identityStore = createStore('identity', 'keyval')

export const imageStore = createStore('image', 'keyval')
