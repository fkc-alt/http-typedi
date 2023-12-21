/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '../decorators'
import { Type } from '../interfaces/type.interface'

@Injectable()
export class Reflector {
  public get<TResult = any, TKey = any>(
    metadataKey: TKey,
    target: Type<any> | Function,
    func?: Function
  ): TResult {
    const _args: any = [
      metadataKey,
      target,
      func?.name?.replace(/^bound /, '')
    ].filter(Boolean)
    _args.length === 2 && (_args[1] = _args[1].constructor)
    // eslint-disable-next-line prefer-spread
    return Reflect.getMetadata.apply(Reflect, _args)
  }
}
