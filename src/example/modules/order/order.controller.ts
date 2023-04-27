import type { AxiosRequestConfig } from 'axios'
import { Controller, Get, Post } from '../../../http-typedi'
import RequestService from '../../common/providers/request.service'
import UploadService from '../../common/providers/upload.service'
import { Route } from '..'
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

  @Get('orderDetail', '🙅错误信息')
  public async GetOrderDetail<
    T extends Service.OrderDetailReq,
    U extends Service.OrderDetailRes
  >(configure: GetOrderDetailDto): ServerRes<U> {
    this.orderService.Log()
    return await this.requestService.request<T, U>(
      <AxiosRequestConfig>configure
    )
  }

  @Post('orderList')
  public async GetOrderList<
    T extends Service.OrderListReq,
    U extends Service.OrderListRes
  >(configure: GetOrderListDto): ServerRes<U> {
    return await this.requestService.request<T, U>(
      <AxiosRequestConfig>configure
    )
  }

  @Post('uploadFile')
  public async UploadFile<
    T extends Services.Common.UplaodReq,
    U extends Services.Common.UplaodRes
  >(configure: T): ServerRes<U> {
    return await this.uploadService.uploadFile<AxiosRequestConfig<T>, U>(
      <AxiosRequestConfig>configure
    )
  }

  @Post('uploadBase64')
  public async UploadBase64<
    T extends Services.Common.UplaodReq,
    U extends Services.Common.UplaodRes
  >(configure: T): ServerRes<U> {
    return await this.uploadService.uploadBase64<AxiosRequestConfig<T>, U>(
      <AxiosRequestConfig<T>>configure
    )
  }
}
