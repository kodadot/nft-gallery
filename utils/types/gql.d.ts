declare module '*.gql' {
  import type { DocumentNode } from 'graphql'

  const content: DocumentNode
  export default content
}

declare module '*.graphql' {
  import type { DocumentNode } from 'graphql'

  const content: DocumentNode
  export default content
}
