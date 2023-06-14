import {
  Controller,
  GetMapping,
  PostMapping,
  RequestService,
  RequestConfig,
  UploadService
} from '@/index'
import { OrderRouteChildren, Route } from '..'
import OrderService from './order.service'
import GetOrderListDto from './dto/orderList.dto'
import GetOrderDetailDto from './dto/orderDetail.dto'

@Controller(Route.ORDER)
export default class OrderController {
  constructor(
    private readonly requestService: RequestService,
    private readonly orderService: OrderService,
    private readonly uploadService: UploadService
  ) {}

  @GetMapping(OrderRouteChildren.ORDERDETAIL, '🙅错误信息')
  public async GetOrderDetail<
    T extends Service.OrderDetailReq,
    U extends Service.OrderDetailRes
  >(configure: GetOrderDetailDto): Promise<U> {
    this.orderService.Log()
    return await this.requestService.request<T, U>(<RequestConfig<T>>configure)
  }

  @PostMapping(OrderRouteChildren.ORDERLIST)
  public async GetOrderList<
    T extends Service.OrderListReq,
    U extends Service.OrderListRes
  >(configure: GetOrderListDto): Promise<U> {
    return await this.requestService.request<T, U>(<RequestConfig<T>>configure)
  }

  @PostMapping(OrderRouteChildren.UPLOADFILE)
  public async UploadFile<
    T extends Services.Common.UplaodReq,
    U extends Services.Common.UplaodRes
  >(configure: T): ServerRes<U> {
    return await this.uploadService.uploadFile<T, ServerRes<U>>(
      <RequestConfig<T>>configure
    )
  }

  @PostMapping(OrderRouteChildren.UPLOADBASE64)
  public async UploadBase64<
    T extends Services.Common.UplaodReq,
    U extends Services.Common.UplaodRes
  >(configure: T): ServerRes<U> {
    return await this.uploadService.uploadBase64<T, ServerRes<U>>(
      <RequestConfig<T>>configure
    )
  }
}
