export default function (number: number) {
  const isInteger = Number.isInteger(number)
  return isInteger ? number.toString() : number.toFixed(4)
}
