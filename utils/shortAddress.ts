const shortAddress = (
  address: string,
  begin?: number,
  end?: number
): string => {
  begin = begin ? begin : 6;
  end = end ? end : -6;

  if (address) {
    return `${address.slice(0, begin)}...${address.slice(end)}`;
  }
  return '';
};

export default shortAddress;
