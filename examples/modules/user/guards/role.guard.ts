import {
  Injectable,
  CanActivate,
  ExecutionContext,
  RequestConfig,
  RequestMethod
} from '@/index'

function validateRequest<T>(req: RequestConfig<T>): boolean | Promise<boolean> {
  console.log(req, 'validateRequest')
  return req.method === RequestMethod.GET
}

@Injectable()
export class RoleGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context
      .switchToHttp()
      .getRequest<RequestConfig<any>>()
    console.log(context, 'canActivate', request)
    return validateRequest(request)
  }
}
