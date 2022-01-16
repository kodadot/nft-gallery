type Id = string | number;
type Owner = { Id: string };

export enum NFTAction {
  SEND = 'SEND',
  CONSUME = 'CONSUME',
  FREEZE = 'FREEZE',
  DELEGATE = 'DELEGATE',
  THAW = 'THAW',
  REVOKE = 'REVOKE',
  NONE = '',
}

export const actionResolver: Record<NFTAction, [string, string]> = {
  SEND: ['uniques', 'transfer'],
  CONSUME: ['uniques', 'burn'],
  DELEGATE: ['uniques', 'approveTransfer'],
  FREEZE: ['uniques', 'freeze'],
  THAW: ['uniques', 'thaw'],
  REVOKE: ['uniques', 'cancelApproval'],
  '': ['', ''],
};

export const basicUpdateFunction = (name: string, index: number): string =>
  `${name} #${index + 1}`;

class NFTUtils {
  static createCollection(id: Id, admin: string): [string, Owner] {
    return [String(id), { Id: admin }];
  }

  static createNFT(
    classId: Id,
    id: Id,
    owner: string
  ): [string, string, Owner] {
    return [String(classId), String(id), { Id: owner }];
  }

  static getActionParams(
    selectedAction: NFTAction,
    classId: Id,
    id: Id,
    meta: string
  ): Id[] {
    switch (selectedAction) {
      case NFTAction.SEND:
      case NFTAction.CONSUME:
      case NFTAction.DELEGATE:
      case NFTAction.REVOKE:
        return [classId, id, meta];
      case NFTAction.FREEZE:
      case NFTAction.THAW:
        return [classId, id];
      default:
        throw new Error('Action not found');
    }
  }

  static apiCall(selectedAction: NFTAction) {
    return actionResolver[selectedAction] || new Error('Action not found');
  }

  static correctMeta(
    selectedAction: NFTAction,
    meta: string,
    currentOwner: string,
    delegate: string
  ): string {
    switch (selectedAction) {
      case NFTAction.SEND:
      case NFTAction.DELEGATE:
        return meta;
      case NFTAction.CONSUME:
        return currentOwner;
      case NFTAction.REVOKE:
        return delegate;
      case NFTAction.FREEZE:
      case NFTAction.THAW:
        return '';
      default:
        throw new Error('Action not found');
    }
  }
}

export default NFTUtils;
