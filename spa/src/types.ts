export interface KeyringPair$Meta {
  [index: string]: any;
}

export interface KeyringAccount {
  address: string;
  meta: KeyringPair$Meta;
  publicKey: string;
  type: string;
}
