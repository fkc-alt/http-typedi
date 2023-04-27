import { IsNotEmpty, IsString } from 'class-validator'

export default class LoginDto implements Service.LoginReq {
  @IsString()
  @IsNotEmpty({ message: 'username 不能为空' })
  username!: string

  @IsString()
  @IsNotEmpty({ message: 'password 不能为空' })
  password!: string
}
