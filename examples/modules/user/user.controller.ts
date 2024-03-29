import {
  Controller,
  GetMapping,
  PostMapping,
  RequestService,
  RequestConfig,
  Reflector,
  SetMetadata,
  UseGuards
} from '@/index'
import { Route, UserRouteChildren } from '..'
import UserService from './user.service'
import LoginDto from './dto/login.dto'
import UserInfoDto from './dto/userInfo.dto'
import { Auth } from './decorators/auth.decorator'
import { RoleGuard } from './guards/role.guard'

@Controller(Route.USER)
@SetMetadata('roles', ['UserController'])
export default class UserController {
  constructor(
    private readonly requestService: RequestService,
    private readonly userService: UserService
  ) {}

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['editor'])
  @PostMapping(UserRouteChildren.LOGIN)
  public async Login<T extends Service.LoginReq, U extends Service.LoginRes>(
    configure: LoginDto
  ): ServerRes<U> {
    this.userService.Log()
    return await this.requestService.request<T, ServerRes<U>>(
      <RequestConfig<T>>configure
    )
  }

  @UseGuards(new RoleGuard())
  @SetMetadata('roles', ['admin', 'editor'])
  @GetMapping(UserRouteChildren.INFO)
  public async UserInfo<
    T extends Service.UserInfoReq,
    U extends Service.UserInfoRes
  >(configure: UserInfoDto): ServerRes<U> {
    const { ...Rest } = <RequestConfig<T>>configure
    console.log(this, 'this')
    return await this.requestService.request<T, ServerRes<U>>(
      <RequestConfig<T>>configure
    )
  }
}
