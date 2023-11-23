/**
 * Decorator that assigns metadata to the class/function using the
 * specified `key`.
 *
 * Requires two parameters:
 * - `key` - a value defining the key under which the metadata is stored
 * - `value` - metadata to be associated with `key`
 *
 * This metadata can be reflected using the `Reflector` class.
 *
 * Example: `@SetMetadata('roles', ['admin'])`
 *
 * @publicApi
 */

import { createDecoratorBind } from '../../helper'

export const SetMetadata = <K = string, V = any>(
  metadataKey: K,
  metadataValue: V
): MethodDecorator & ClassDecorator =>
  createDecoratorBind(<any>metadataKey, metadataValue)
