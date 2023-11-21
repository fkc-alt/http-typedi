import {
  Controller,
  GetMapping,
  PostMapping,
  RequestService,
  RequestConfig,
  Reflector
} from '@/index'
import { Route, UserRouteChildren } from '..'
import UserService from './user.service'
import LoginDto from './dto/login.dto'
import UserInfoDto from './dto/userInfo.dto'
import { Auth } from './decorators/auth.decorator'

@Controller(Route.USER)
export default class UserController {
  constructor(
    private readonly requestService: RequestService,
    private readonly userService: UserService,
    private readonly reflector: Reflector
  ) {}

  @PostMapping(UserRouteChildren.LOGIN)
  public async Login<T extends Service.LoginReq, U extends Service.LoginRes>(
    configure: LoginDto
  ): ServerRes<U> {
    this.userService.Log()
    return await this.requestService.request<T, ServerRes<U>>(
      <RequestConfig<T>>configure
    )
  }

  @GetMapping(UserRouteChildren.INFO)
  @Auth()
  public async UserInfo<
    T extends Service.UserInfoReq,
    U extends Service.UserInfoRes
  >(configure: UserInfoDto): ServerRes<U> {
    const { ...Rest } = <RequestConfig<T>>configure
    console.log(Rest, 'reflector', this.reflector.get('roles', this))
    console.log(this, 'this')
    return await this.requestService.request<T, ServerRes<U>>(
      <RequestConfig<T>>configure
    )
  }
}
