import { IsNotEmpty, IsString } from 'class-validator'

export default class GetOrderDetailDto implements Service.OrderDetailReq {
  @IsString()
  @IsNotEmpty({ message: 'orderId 不能为空' })
  orderId!: string
}
