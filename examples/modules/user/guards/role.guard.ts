/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  RequestConfig,
  RequestMethod,
  Reflector,
  MetadataKey
} from '@/index'
import { Roles } from '~@/enum'
import ArticleController from '~@/modules/article/article.controller'
import UserController from '../user.controller'

function validateRequest<T>(req: RequestConfig<T>): boolean | Promise<boolean> {
  // custom validation
  console.log(req, 'validateRequest')
  return req.method === RequestMethod.GET
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context
      .switchToHttp()
      .getRequest<RequestConfig<any>>()
    const roles =
      this.reflector.get<string[]>(
        'roles',
        context.getClass(),
        context.getHandler()
      ) || []
    const validateSync = roles.some(role => Roles.ADMIN === role)
    console.log(
      this.reflector.getAll(MetadataKey.INJECTABLE_WATERMARK, [
        ArticleController,
        UserController
      ]),
      'test getAll'
    )
    console.log(roles, validateSync, request, 'RoleGuard', this)
    // return validateRequest(request)
    return validateSync
  }
}
