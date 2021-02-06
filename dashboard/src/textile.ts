import { Client, KeyInfo } from '@textile/hub'

export async function client(): Promise<Client> {
   return await Client.withKeyInfo(keyInfo)
}

export const keyInfo: KeyInfo = {
  key: 'b33djj73skzjx3xdt35lvjqcd5a',
  secret: process.env.VUE_APP_TEXTILE_SECRET
}
