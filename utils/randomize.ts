import format from 'date-fns/format'

export function uidCrypto(length = 9) {
  const array = new Uint32Array(1)
  const randomNumber = window.crypto.getRandomValues(array)[0]
  const paddedNumber = randomNumber.toString().padStart(length, '0')
  return paddedNumber.slice(0, length)
}

export function uidMathDate(length = 6) {
  const date = format(new Date(), 'yyMM')
  return date + uidCrypto(length)
}
