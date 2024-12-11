export function removeDuplicateSortKeys(options: string[]) {
  const uniqueOptions = {}

  if (!Array.isArray(options)) {
    return []
  }

  options.forEach((option) => {
    const [identifier, ...rest] = option.split('_')
    const sort = rest.join('_')

    uniqueOptions[identifier] = sort
  })

  return Object.keys(uniqueOptions).map((identifier) => {
    return `${identifier}_${uniqueOptions[identifier]}`
  })
}
