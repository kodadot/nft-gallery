export const buildIncomingTradesQuery = (address: string, considereds: string[], string = false) => {
  const query = {
    AND: [
      {
        status_eq: 'ACTIVE',
        caller_not_eq: address,
      },
      {
        OR: [
          { desired: { currentOwner_eq: address } },
          {
            considered: {
              id_in: JSON.stringify(considereds),
            },
            desired_isNull: true,
          },
        ],
      },
    ],
  }

  // I need both version of this query, one as string and one as object
  // super hacky, but it works, I'll find better solution
  if (string) {
    return JSON.stringify(query)
      // Remove quotes around keys (e.g., "status_eq": becomes status_eq:)
      .replace(/"([a-zA-Z0-9_]+)":/g, '$1:')
      // Remove quotes around uppercase values (e.g., "ACTIVE" becomes ACTIVE)
      .replace(/"([A-Z]+)"/g, '$1')
      // Fix array formatting if it's incorrectly a stringified array (e.g.,  "[\"493\",\"450\"]" becomes ["493","450"])
      .replace(/\\"/g, '"')
      .replace(/"\[/g, '[')
      .replace(/\]"/g, ']')
  }

  return query
}
