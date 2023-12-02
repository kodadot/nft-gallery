export const localStorage = process.client ? window.localStorage : undefined
export const sessionStorage = process.client ? window.sessionStorage : undefined
export const location = process.client ? window.location : undefined
export const navigator = process.client ? window.navigator : undefined
export const document = process.client ? window.document : undefined
export const history = process.client ? window.history : undefined
