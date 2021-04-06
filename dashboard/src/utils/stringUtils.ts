
export const truncateStr = (s: string, maxLen : number = 20): string => {
    if (s.length < maxLen) {
      return s;
    }
    return s.substring(0, maxLen) + "...";
};