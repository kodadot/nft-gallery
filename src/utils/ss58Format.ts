
const correctFormat = (ss58?: number | string | null): number => {
  switch (typeof ss58) {
    case 'number':
      return ss58
    case 'string':
        return Number(ss58) >= 0 ? Number(ss58) : 42
    default:
      return 42
  }
}


export default correctFormat
