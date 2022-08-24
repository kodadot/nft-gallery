// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (req, operationName) => {
  const { body } = req
  return (
    // eslint-disable-next-line no-prototype-builtins
    body.hasOwnProperty('operationName') && body.operationName === operationName
  )
}

// Alias query if operationName matches
export const aliasQuery = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `${operationName}Query`
  }
}

// Alias mutation if operationName matches
export const aliasMutation = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `${operationName}Mutation`
  }
}
