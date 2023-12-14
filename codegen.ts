import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  generates: {
    './__generated__/': {
      plugins: ['typescript'],
      preset: 'client',
      documents: './queries/typed-queries/popularCollectionList.ts',
      presetConfig: {
        fragmentMasking: false,
        gqlTagName: 'gql',
      },
    },
    './__generated__/resolvers-types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
  schema: 'https://squid.subsquid.io/stick/graphql',
}

export default config
