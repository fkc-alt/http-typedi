import { Injectable } from '../decorators'
import { MetadataKey } from '../enums'
import { HttpFactoryMap } from '../http-factory-map'

@Injectable()
export class Reflector {
  public get(token: string, ctx: any): any {
    const IOC_RELATION_token = Reflect.getMetadata(
      MetadataKey.TOKEN,
      ctx.constructor
    )
    const IOC = HttpFactoryMap.get(IOC_RELATION_token)
    console.log(IOC, 'IOC', IOC_RELATION_token, HttpFactoryMap)
    return IOC
  }
}
