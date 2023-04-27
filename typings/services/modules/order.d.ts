declare namespace Service {
  interface OrderItem {
    name: string
    stock: number
    orderId: string
    price: number
  }
  interface OrderListReq extends Services.Common.Pagination {}
  interface OrderListRes {
    orderList: OrderItem[]
  }
  interface OrderDetailReq {
    orderId: string
  }
  interface OrderDetailRes extends OrderItem {}

  type TableDataRecord = Record<'date' | 'name' | 'address', string>
  interface TableDataRes {
    tableList: TableDataRecord[]
  }
  interface TableDataReq extends Services.Common.Pagination {}
}
