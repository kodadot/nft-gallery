/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query popularCollectionList(\n    $limit: Float\n    $orderBy: String\n    $dateRange: String\n    $orderDirection: String\n  ) {\n    seriesInsightTable(\n      limit: $limit\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      dateRange: $dateRange\n    ) {\n      id\n      image\n      metadata\n      sold\n      name\n      issuer\n      total\n      buys\n    }\n  }\n": types.PopularCollectionListDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query popularCollectionList(\n    $limit: Float\n    $orderBy: String\n    $dateRange: String\n    $orderDirection: String\n  ) {\n    seriesInsightTable(\n      limit: $limit\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      dateRange: $dateRange\n    ) {\n      id\n      image\n      metadata\n      sold\n      name\n      issuer\n      total\n      buys\n    }\n  }\n"): (typeof documents)["\n  query popularCollectionList(\n    $limit: Float\n    $orderBy: String\n    $dateRange: String\n    $orderDirection: String\n  ) {\n    seriesInsightTable(\n      limit: $limit\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      dateRange: $dateRange\n    ) {\n      id\n      image\n      metadata\n      sold\n      name\n      issuer\n      total\n      buys\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;