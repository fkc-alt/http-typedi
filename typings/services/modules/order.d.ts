declare namespace Service {
  interface OrderItem {
    name: string
    stock: number
    orderId: string
    price: number
  }
  type OrderListReq = Services.Common.Pagination
  interface OrderListRes {
    orderList: OrderItem[]
  }
  interface OrderDetailReq {
    orderId: string
  }
  type OrderDetailRes = OrderItem

  type TableDataRecord = Record<'date' | 'name' | 'address', string>
  interface TableDataRes {
    tableList: TableDataRecord[]
  }
  type TableDataReq = Services.Common.Pagination
}
