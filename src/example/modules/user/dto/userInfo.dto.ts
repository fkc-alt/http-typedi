import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export default class UserInfoDto implements Service.UserInfoReq {
  @IsNumber()
  @IsNotEmpty({ message: 'id 不能为空' })
  id!: number

  @IsString()
  @IsNotEmpty({ message: 'phone 不能为空' })
  phone!: string
}
