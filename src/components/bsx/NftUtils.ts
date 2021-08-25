import { ClassData, TokenData } from './types';

class NFTUtils {
  static createCollection(metadata: string): [string, ClassData] {
    return [metadata, new ClassData()];
  }

  static createNFT(classId: string | number, metadata: string, quantity: number = 1)  {
    return [classId, metadata, new TokenData(), quantity];
  }

}



export default NFTUtils
