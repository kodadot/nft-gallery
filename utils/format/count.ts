export function format(num) {
  if (num === null || num === undefined) {
    return ''
  }
  return String(
    Math.abs(num) > 999
      ? `${Math.sign(num) * +(Math.abs(num) / 1000).toFixed(1)}k`
      : Math.sign(num) * Math.abs(num)
  )
}
