const shortAddress = (address: string): string => {
  if (address) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }
  return '';
};

export default shortAddress;
