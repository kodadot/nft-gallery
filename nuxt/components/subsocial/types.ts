
import { CommonData,  PostContent } from '@subsocial/types'
import { Post } from '@subsocial/types/substrate/interfaces'
import { ProfileContent } from '@subsocial/types/offchain'

export type Optional<T> = T | undefined;

export type PostType = Optional<CommonData<Post, PostContent>>

export type ProfileContentType = ProfileContent

export type OptionalProfileContent = Optional<ProfileContent>

export enum ReactionType {
  Upvote,
  Downvote
}
