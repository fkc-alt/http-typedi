/* eslint-disable @typescript-eslint/ban-types */
import { MetadataKey } from '../../enums'
import { createDecoratorBind } from '../../helper'
import { CanActivate } from './interfaces/can-activate.interface'

/**
 * Decorator that binds guards to the scope of the controller or method,
 * depending on its context.
 *
 * When `@UseGuards` is used at the controller level, the guard will be
 * applied to every handler (method) in the controller.
 *
 * When `@UseGuards` is used at the individual handler level, the guard
 * will apply only to that specific method.
 *
 * @param guards a single guard instance or class, or a list of guard instances
 * or classes.
 *
 * @see [Guards](https://fkc-alt.github.io/http-typedi/guide/guard/)
 *
 * @usageNotes
 * Guards can also be set up globally for all controllers and routes
 * using `app.useGlobalGuards()`.  [See here for details](https://fkc-alt.github.io/http-typedi/guide/global-config/use-guards)
 *
 * @publicApi
 */
export const UseGuards = (
  ...guards: (CanActivate | Function)[]
): MethodDecorator & ClassDecorator =>
  createDecoratorBind(MetadataKey.GUARDS, guards)
