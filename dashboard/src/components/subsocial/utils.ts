import { resolveSubsocialApi } from './api';
import BN from 'bn.js';
import { OptionalProfileContent } from './types'
import { formatAccount } from '@/utils/account';
export const SUBSOCIAL_SS58 = 28;

export const findCommentsForPost =  async (postId: string) => {
  const ss = await resolveSubsocialApi();
  const commentIds = await ss.substrate.getReplyIdsByPostId(new BN(postId))
  const commentPromises =  commentIds.map(cm => ss.findPublicPost(cm))
  return await Promise.all(commentPromises);
}

export const findProfile =  async (account: string): Promise<OptionalProfileContent> => {
  const ss = await resolveSubsocialApi();
  const profile = await ss.findProfile(account)
  return profile?.content
}

export const subsocialAddress = (accountId: string) => formatAccount(accountId, SUBSOCIAL_SS58)
