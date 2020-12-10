import { Client, KeyInfo, ThreadID } from '@textile/hub'

export async function client(): Promise<Client> {
  const keyInfo: KeyInfo = {
    key: 'b33djj73skzjx3xdt35lvjqcd5a',
    secret: 'b76cuc62htqartpmywmzd3wyrym66xtmmjq4s2wy'
  }
   return await Client.withKeyInfo(keyInfo)
}

