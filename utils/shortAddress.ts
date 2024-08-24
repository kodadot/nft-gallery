const shortAddress = (
  address: string,
  begin: number = 6,
  end: number = -6,
): string => address ? `${address.slice(0, begin)}...${address.slice(end)}` : ''

export default shortAddress
