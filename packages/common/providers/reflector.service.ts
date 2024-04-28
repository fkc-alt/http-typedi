/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '../decorators'
import { Type } from '../interfaces/type.interface'

/**
 *
 * @export
 * @class Reflector
 */
@Injectable()
export class Reflector {
  /**
   *
   * @template TResult
   * @template TKey
   * @param {TKey} metadataKey
   * @param {(Type<any> | Function)} target
   * @param {Function} [func]
   * @return {*}  {TResult}
   * @memberof Reflector
   */
  public get<TResult = any, TKey = any>(
    metadataKey: TKey,
    target: Type<any> | Function,
    func?: Function
  ): TResult {
    const _args: any = [
      metadataKey,
      target,
      // 因为框架会重写所有方法&修改this，所以函数name会有bound
      func?.name?.replace(/^bound /, '')
    ].filter(Boolean)
    _args.length === 2 && (_args[1] = _args[1].constructor)
    // eslint-disable-next-line prefer-spread
    return Reflect.getMetadata.apply(Reflect, _args)
  }

  /**
   *
   * @template TResult
   * @template TKey
   * @param {TKey} metadataKey
   * @param {((Type<any> | Function)[])} targets
   * @return {*}  {TResult}
   * @memberof Reflector
   */
  public getAll<TResult extends any[] = any[], TKey = any>(
    metadataKey: TKey,
    targets: (Type<any> | Function)[]
  ): TResult {
    return <TResult>(
      targets.map(target => Reflect.getMetadata(metadataKey, target))
    )
  }
}
